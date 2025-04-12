import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import Config from "../../../Config";

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
    <div className="bg-white shadow-xl p-6 rounded-lg w-full max-w-md">
      {children}
      <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

const Checkbox = ({ label, onChange }) => (
  <label className="block mb-2">
    <input type="checkbox" className="mr-2" onChange={onChange} />
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
        className={`cursor-pointer text-xl ${star <= value ? "text-yellow-500" : "text-gray-300"}`}
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
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
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
        })
        const parsedOrders = res.data.orders.map(order => ({
          ...order,
          service: JSON.parse(order.service.replace(/'/g, '"')), // Convert single quotes to double quotes for JSON.parse
        }));
        console.log(parsedOrders);
        setBookings(parsedOrders);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelService = (index) => {
    setCancelModalIndex(index);
    setCancelReason([]);
    setOtherReason("");
  };

  const handleCancelSubmit = () => {
    const reasonText = cancelReason.includes("Other") ? otherReason : cancelReason.join(", ");
    const updated = [...bookings];
    updated[cancelModalIndex].status = "cancelled";
    updated[cancelModalIndex].cancelReason = reasonText;
    setBookings(updated);
    setCancelModalIndex(null);
  };

  const handleCheckboxChange = (reason) => {
    setCancelReason((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleRatingSubmit = (index) => {
    const updated = [...bookings];
    updated[index].rating = rating;
    updated[index].feedback = feedback;
    setBookings(updated);
    setRating(0);
    setFeedback("");
  };

  const renderStatus = (status) => {
    switch (status) {
      case "arriving":
        return <span className="text-yellow-500">🚚 Arriving</span>;
      case "completed":
        return <span className="text-green-600">✅ Completed</span>;
      case "cancelled":
        return <span className="text-red-500">❌ Cancelled</span>;
        case "Pending":
        return <span className="text-red-500">Pending</span>;
      default:
        return "";
    }
  };

  const renderPaymentStatus = (status, payment) => {
    if (status === "cancelled") return payment === "Cash" ? null : "Money Refund in Process";
    return payment === "Cash" ? "COD" : "Paid";
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-24 p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Bookings</h1>

        {loading && <p className="text-center">Loading services...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {bookings.map((service, index) => (
          <div key={index} className="border p-4 mb-4 rounded-md flex flex-col md:flex-row gap-40 items-start">
                 <div className="flex flex-col gap-4">
  {service.service.map((srv, srvIndex) => (
    <div key={srvIndex} className="flex flex-col items-center">
      <img
        src={`${Config.MEDIA_URL}${srv.images}`}
        alt={srv.name}
        className="w-24 h-24 object-cover rounded-md"
      />
    </div>
  ))}
</div>


            <div className="flex-1">
            {service.service.map((srv, srvIndex) => (
              <div key={srvIndex}>
                <h2 className="text-xl font-semibold">{srv.name}</h2>
                <p>Quantity: {srv.quantity}</p>
                <p>Price: {srv.price}</p>
              </div>
            ))}

              <p>Payment Status: {service.payment_method}</p>
              <p>Status: {renderStatus(service.status)}</p>
              {service.cancelReason && <p>Cancel Reason: {service.cancelReason}</p>}

              {service.status === "arriving" && (
                <Button className="bg-red-500 text-white mt-2 hover:bg-red-600" onClick={() => handleCancelService(index)}>
                  Cancel Service
                </Button>
              )}

              {service.status === "completed" && !service.rating && (
                <>
                  <Rating value={rating} onChange={setRating} />
                  {rating > 0 && (
                    <>
                      <Textarea
                        placeholder="Leave feedback..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                      <Button
                        className="bg-blue-500 text-white mt-2 hover:bg-blue-600"
                        onClick={() => handleRatingSubmit(index)}
                      >
                        Submit Feedback
                      </Button>
                    </>
                  )}
                </>
              )}

              {service.rating && <p>Rating: {service.rating} ⭐</p>}
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Slot:</strong> {service.preferred_time}</p>
              {/* <p><strong>Date:</strong> {service.date}</p> */}
              <p className="break-words whitespace-normal">
              <strong>Address:</strong> {service.flat_building}, {service.landmark}, {service.city}, {service.pincode}, {service.address}
            </p>
            <p><strong>Total Amount:</strong> {service.total_amount}</p>
              </div>
          </div>
        ))}

        {cancelModalIndex !== null && (
          <Modal onClose={() => setCancelModalIndex(null)}>
            <h3 className="text-xl font-bold mb-4">Select Cancel Reason</h3>
            <Checkbox label="Delayed Service" onChange={() => handleCheckboxChange("Delayed Service")} />
            <Checkbox label="Unsatisfactory Service" onChange={() => handleCheckboxChange("Unsatisfactory Service")} />
            <Checkbox label="Other" onChange={() => handleCheckboxChange("Other")} />
            {cancelReason.includes("Other") && (
              <Textarea
                placeholder="Enter other reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            )}
            <Button className="bg-red-500 text-white mt-4 hover:bg-red-600" onClick={handleCancelSubmit}>
              Submit Cancellation
            </Button>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ServicePage;
