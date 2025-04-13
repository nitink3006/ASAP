import { useState } from "react";
import { MapPin, Clock, CreditCard } from "lucide-react";
import Config from "../../../../Config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookingDetails = ({ totalAmount, selectedServices }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token || null;
    const userDetails = user?.user[0] || {};
    const total_amount = totalAmount || 0;
    const [formData, setFormData] = useState({
        name: userDetails.name || "",
        phone: userDetails.phone || "",
        email: userDetails.email || "",
        flat_building: userDetails.flat_building || "",
        landmark: userDetails.landmark || "",
        address: userDetails.address || "",
        city: userDetails.city || "",
        pincode: userDetails.pincode || "",
        preferred_time: "",
        payment_method: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBooking = async () => {
        const service = (selectedServices || []).map((item) => ({
            name: item.service.name,
            price: item.service.price,
            id: item.id,
            images: item.service.images,
            quantity: item.quantity || 1,
        }));
        const payload = {
            ...formData,
            total_amount,
            service,
        };

        try {
            const response = await fetch(`${Config.API_URL}/bookings/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Booking failed");
            }

            if (formData.payment_method === "COD") {
                toast.success("Service Confirmed!");
                navigate("/your-order");
            } else {
                setShowSuccessModal(true);
            }
        } catch (error) {
            toast.error("order confirmation failed. Please try again.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
            {user ? (
                <>
                    <div>
                        <h2 className="text-xl font-bold mb-1">
                            Booking Details
                        </h2>
                        <p className="text-gray-600">
                            Fill in your information to confirm your booking.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Flat / Building
                            </label>
                            <input
                                type="text"
                                name="flat_building"
                                value={formData.flat_building}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Landmark
                            </label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Pincode
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            />
                        </div>
                    </div>

                    {/* preferred_time Selection & payment_method
                     */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Clock size={16} />
                                SLOT
                            </label>
                            <input
                                type="time"
                                name="preferred_time"
                                value={formData.preferred_time}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                                <CreditCard size={16} />
                                payment method
                            </label>
                            <select
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                            >
                                <option value="">Select</option>
                                <option value="COD">Cash on Delivery</option>
                                <option value="UPI">UPI</option>
                                <option value="Card">Card</option>
                            </select>
                        </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-1">
                            Cancellation Policy
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                            Free cancellations if done more than 3 hrs before
                            the service or if a professional isn’t assigned. A
                            fee will be charged otherwise.
                        </p>
                        <a
                            href="#"
                            className="text-[#7B41E6] font-semibold underline text-xs"
                        >
                            Read full policy
                        </a>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            className="w-full bg-[#7B41E6] cursor-pointer text-white py-2 rounded-md font-semibold hover:bg-[#6734c2] transition"
                            onClick={handleBooking}
                        >
                            Confirm Booking
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <h2 className="text-xl font-bold">Account</h2>
                    <p className="text-gray-600 mt-2">
                        To book the service, please login or sign up
                    </p>
                    <button className="w-full mt-4 bg-[#7B41E6] text-white py-2 rounded-md font-semibold hover:bg-[#6734c2] transition">
                        Login
                    </button>
                </div>
            )}
            {showSuccessModal && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-2">
                            payment method Successful!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Your booking has been confirmed.
                        </p>
                        <button
                            className="bg-[#7B41E6] text-white py-2 cursor-pointer px-4 rounded hover:bg-[#6734c2]"
                            onClick={() => navigate("/your-order")}
                        >
                            Go to Order Page
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetails;
