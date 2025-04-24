import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import Config from "../../../Config";

const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-xs z-50 flex justify-center items-center p-4">
        <div className="bg-gray-200 shadow-2xl p-8 rounded-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            {children}
        </div>
    </div>
);

const Checkbox = ({ label, onChange }) => (
    <label className="block mb-2">
        <input
            type="checkbox"
            className="mr-2 cursor-pointer"
            onChange={onChange}
        />
        {label}
    </label>
);

const Textarea = ({ ...props }) => (
    <textarea className="w-full p-2 border rounded-md mt-2" {...props} />
);

const Button = ({ className = "", ...props }) => (
    <button
        className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 ${className}`}
        {...props}
    />
);

const Rating = ({ value, onChange }) => (
    <div className="flex space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`cursor-pointer text-xl ${
                    star <= value ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => onChange(star)}
            >
                ★
            </span>
        ))}
    </div>
);

const ServicePage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelModalIndex, setCancelModalIndex] = useState(null);
    const [cancelReason, setCancelReason] = useState([]);
    const [otherReason, setOtherReason] = useState("");
    const [ratings, setRatings] = useState({});
    const [feedbacks, setFeedbacks] = useState({});
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token || null;

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${Config.API_URL}/bookings/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                const parsedOrders = res.data.orders.map((order) => ({
                    ...order,
                    service: JSON.parse(order.service.replace(/'/g, '"')), // Convert single quotes to double quotes for JSON.parse
                }));
                setBookings(parsedOrders);
            } catch (err) {
                setError("Failed to load bookings.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelSubmit = async () => {
        const reasonText = cancelReason.includes("Other")
            ? otherReason
            : cancelReason.join(", ");
        const booking = bookings[cancelModalIndex];

        try {
            await axios.patch(
                `${Config.API_URL}/bookings/${booking.id}/update/`,
                {
                    is_cancel: true,
                    review: reasonText,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const updated = [...bookings];
            updated[cancelModalIndex].status = "Cancelled";
            updated[cancelModalIndex].cancelReason = reasonText;
            setBookings(updated);
            setCancelModalIndex(null);
        } catch (error) {
            console.error("Failed to cancel:", error);
            setError("Failed to cancel the booking. Please try again.");
        }
    };

    const handleCancelService = (index) => {
        setCancelModalIndex(index);
        setCancelReason([]);
        setOtherReason("");
    };

    const handleCheckboxChange = (reason) => {
        setCancelReason((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    const handleRatingSubmit = async (index) => {
        const booking = bookings[index];
        const currentRating = ratings[index];
        const currentFeedback = feedbacks[index];

        try {
            const response = await axios.patch(
                `${Config.API_URL}/bookings/${booking.id}/update/`,
                {
                    rating: currentRating,
                    feedback: currentFeedback,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            const updated = [...bookings];
            updated[index].rating = currentRating;
            setBookings(updated);
        } catch (error) {
            console.error("Failed to submit rating", error);
        }
    };

    const renderStatus = (status) => {
        switch (status) {
            case "Arriving":
                return <span className="text-yellow-500">🚚 Arriving</span>;
            case "Completed":
                return <span className="text-green-600">✅ Completed</span>;
            case "Cancelled":
                return <span className="text-red-500">❌ Cancelled</span>;
            case "Pending":
                return <span className="text-red-500">Pending</span>;
            default:
                return "";
        }
    };

    const renderPaymentStatus = (status, payment) => {
        if (status === "cancelled")
            return payment === "Cash" ? null : "Money Refund in Process";
        return payment === "Cash" ? "COD" : "Paid";
    };

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto mt-24 p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Your Bookings
                </h1>

                {loading && <p className="text-center">Loading services...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {bookings.map((service, index) => (
                    <div
                        key={index}
                        className="border p-6 mb-6 rounded-lg flex flex-col md:flex-row md:items-start gap-8 bg-white shadow-sm"
                    >
                        {/* Image Section */}
                        <div className="flex flex-col gap-4 w-full md:w-1/4 items-center">
                            {service.service.map((srv, srvIndex) => (
                                <div
                                    key={srvIndex}
                                    className="flex flex-col items-center"
                                >
                                    <img
                                        src={`${Config.MEDIA_URL}${srv.images}`}
                                        alt={srv.name}
                                        className="w-24 h-24 object-cover rounded-md border"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Service Info Section */}
                        <div className="flex-1 md:w-2/4 space-y-3">
                            {service.service.map((srv, srvIndex) => (
                                <div key={srvIndex} className="border-b pb-2">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {srv.name}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Quantity: {srv.quantity}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Price: ${srv.price}
                                    </p>
                                </div>
                            ))}

                            <p className="text-sm text-gray-700 mt-2">
                                <strong>Payment Status:</strong>{" "}
                                {service.payment_method}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Status:</strong>{" "}
                                {service.is_cancel === false
                                    ? renderStatus(service.status)
                                    : "❌ Cancelled"}
                            </p>

                            {service.review && (
                                <p className="text-sm text-red-500">
                                    <strong>Cancel Reason:</strong>{" "}
                                    {service.review}
                                </p>
                            )}

                            {service.status === "Completed" &&
                                !service.rating && (
                                    <div className="mt-3">
                                        <Rating
                                            value={ratings[index] || 0}
                                            onChange={(value) =>
                                                setRatings((prev) => ({
                                                    ...prev,
                                                    [index]: value,
                                                }))
                                            }
                                        />
                                        {ratings[index] > 0 && (
                                            <>
                                                <Textarea
                                                    placeholder="Leave feedback..."
                                                    value={
                                                        feedbacks[index] || ""
                                                    }
                                                    onChange={(e) =>
                                                        setFeedbacks(
                                                            (prev) => ({
                                                                ...prev,
                                                                [index]:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    className="mt-2 border rounded-md p-2 w-full"
                                                />
                                                <Button
                                                    className="bg-blue-500 text-white mt-2 hover:bg-blue-600"
                                                    onClick={() =>
                                                        handleRatingSubmit(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Submit Feedback
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}

                            {service.rating && (
                                <p className="text-sm text-green-600 mt-2">
                                    <strong>Rating:</strong> {service.rating} ⭐
                                </p>
                            )}
                        </div>

                        {/* Slot and Address Section */}
                        <div className="md:w-1/4 text-sm text-gray-700 space-y-2">
                            <p>
                                <strong>Slot:</strong> {service.preferred_time}
                            </p>
                            {/* <p><strong>Date:</strong> {service.date}</p> */}
                            <p className="break-words whitespace-normal">
                                <strong>Address:</strong>{" "}
                                {service.flat_building}, {service.landmark},{" "}
                                {service.city}, {service.pincode},{" "}
                                {service.address}
                            </p>
                            <p>
                                <strong>Total Amount:</strong> ₹
                                {service.total_amount}
                            </p>
                            {(service.status === "Pending" ||
                                service.status === "arriving") && (
                                <Button
                                    className="bg-red-500 text-white mt-2 hover:bg-red-600"
                                    onClick={() => handleCancelService(index)}
                                >
                                    Cancel Order
                                </Button>
                            )}
                        </div>
                    </div>
                ))}

                {cancelModalIndex !== null && (
                    <Modal onClose={() => setCancelModalIndex(null)}>
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                            Cancel Booking
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 text-center">
                            Please let us know why you are cancelling this
                            booking.
                        </p>

                        <div className="space-y-2">
                            <Checkbox
                                label="Delayed Service"
                                onChange={() =>
                                    handleCheckboxChange("Delayed Service")
                                }
                            />
                            <Checkbox
                                label="Unsatisfactory Service"
                                onChange={() =>
                                    handleCheckboxChange(
                                        "Unsatisfactory Service"
                                    )
                                }
                            />
                            <Checkbox
                                label="Other"
                                onChange={() => handleCheckboxChange("Other")}
                            />

                            {cancelReason.includes("Other") && (
                                <Textarea
                                    placeholder="Please specify your reason..."
                                    value={otherReason}
                                    onChange={(e) =>
                                        setOtherReason(e.target.value)
                                    }
                                />
                            )}
                        </div>

                        <div className="flex justify-end mt-6 gap-2">
                            <Button
                                className="bg-gray-300 text-gray-800 hover:bg-gray-400"
                                onClick={() => setCancelModalIndex(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={handleCancelSubmit}
                            >
                                Confirm Cancellation
                            </Button>
                        </div>
                    </Modal>
                )}
            </div>
        </>
    );
};

export default ServicePage;
