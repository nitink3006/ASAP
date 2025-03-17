import { useState } from 'react';
import Navbar from './Navbar';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center">
    <div className="bg-white shadow-2xl p-6 rounded-md w-1/3">
      {children}
      <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md ml-4" onClick={onClose}>Close</button>
    </div>
  </div>
);

const Checkbox = ({ label, onChange }) => (
  <label className="block mb-2 cursor-pointer">
    <input type="checkbox" className="mr-2" onChange={onChange} />
    {label}
  </label>
);

const Textarea = ({ placeholder, value, onChange, className }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={className}
  />
);

const Button = ({ className, onClick, children }) => (
  <button className={`${className} cursor-pointer`} onClick={onClick}>
    {children}
  </button>
);

const Rating = ({ value, onChange }) => (
  <div className="flex space-x-1 mt-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`cursor-pointer text-xl ${star <= value ? 'text-yellow-500' : 'text-gray-300'}`}
        onClick={() => onChange(star)}
      >
        ★
      </span>
    ))}
  </div>
);

const ServicePage = () => {
  const [currentServices, setCurrentServices] = useState([
    { name: "Pest control (includes utensil removal)", image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504494228-eb2d1d.jpeg", orders: 1, price: "$50", payment: "Card", status: 'arriving', cancelReason: null, slot: "6:00 PM to 7 PM",address: "John Doe, 123 Main Street, Apt 4B, Springfield, Illinois, 60601", date:"05/03/2025" }
  ]);

  const [completedServices, setCompletedServices] = useState([
    { name: "Office pest control", image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504277984-7347cb.jpeg", orders: 2, price: "$40", payment: "Cash", status: 'completed', cancelReason: null, slot: "6:00 PM to 7 PM",address: "John Doe, 123 Main Street, Apt 4B, Springfield, Illinois, 60601",date:"05/03/2025" },
    { name: "Retail shop pest control", image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504268966-e3811e.jpeg", orders: 1, price: "$60", payment: "Card", status: 'cancelled', cancelReason: "Delayed Service", slot: "6:00 PM to 7 PM" ,address: "John Doe, 123 Main Street, Apt 4B, Springfield, Illinois, 60601",date:"05/03/2025" }
  ]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState([]);
  const [otherReason, setOtherReason] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);

  const handleCancelService = (index) => {
    setSelectedServiceIndex(index);
    setShowCancelModal(true);
  };

  const handleRatingSubmit = (service) => {
    console.log(`Rating for ${service.name}:`, rating, feedback);
    setRating(0);
    setFeedback("");
  };

  const handleCancelSubmit = () => {
    const reasonText = cancelReason.includes("Other") ? otherReason : cancelReason.join(", ");

    const updatedServices = [...currentServices];
    updatedServices[selectedServiceIndex] = {
      ...updatedServices[selectedServiceIndex],
      status: 'cancelled',
      cancelReason: reasonText
    };

    setCurrentServices(updatedServices);
    setCancelReason([]);
    setOtherReason("");
    setShowCancelModal(false);
  };

  const handleCheckboxChange = (reason) => {
    setCancelReason((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleDeleteService = (index) => {
    const updatedServices = [...currentServices];
    updatedServices.splice(index, 1);
    setCurrentServices(updatedServices);
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'arriving':
        return '🚚 Arriving';
      case 'completed':
        return '✅ Completed';
      case 'cancelled':
        return '❌ Cancelled';
      default:
        return ''; 
    }
  };

  const renderPaymentStatus = (service) => {
    if (service.status === 'cancelled') {
      return service.payment === 'Cash' ? null : 'Money Returned in Process';
    }
    return service.payment === 'Cash' ? 'COD' : 'Paid';
  };

  return (
    <>
    <Navbar />
    <div className="container p-6 mt-20">
        <div className='mx-96'>
      <h1 className="text-3xl font-bold mb-6">Your Services</h1>
      {currentServices.map((service, index) => (
  <div key={index} className="border p-4 mb-4 rounded-md flex space-x-4">
    <img src={service.image} alt={service.name} className="w-16 h-16 object-cover rounded-md" />
    <div className="flex-1">
      <p className="font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">{service.name}</p>
      <p>Orders: {service.orders}</p>
      <p>Price: {service.price}</p>
      <p>Payment Status: {renderPaymentStatus(service)}</p>
      <p>Status: {renderStatusIcon(service.status)}</p>
      {service.cancelReason && <p>Cancel Reason: {service.cancelReason}</p>}
      <Button className="bg-red-500 text-white px-4 py-2 rounded-md mt-2" onClick={() => handleCancelService(index)}>
        Cancel Service
      </Button>
    </div>
    <div className="flex flex-col justify-center items-start mr-4">
      <p>Slot: {service.slot || 'N/A'}</p>
      <p>Date: {service.date || 'N/A'}</p>
      <p>Address: {service.address || 'N/A'}</p>
    </div>
  </div>
))}


      {completedServices.map((service, index) => (
        <div key={index} className="border p-4 mb-4 rounded-md flex items-center space-x-4">
          <img src={service.image} alt={service.name} className="w-16 h-16 object-cover rounded-md" />
          <div>
            <p className="font-bold">{service.name}</p>
            <p>Orders: {service.orders}</p>
            <p>Price: {service.price}</p>
            <p>Payment Status: {renderPaymentStatus(service)}</p>
            <p>Status: {renderStatusIcon(service.status)}</p>
            <p>Date: {service.date}</p>
            {service.cancelReason && <p>Cancel Reason: {service.cancelReason}</p>}
            {service.rating ? (
  <p>Rating: {service.rating} ⭐</p>
) : (
  <>
    <Rating value={rating} onChange={setRating} />
    {rating > 0 && (
      <>
        <Textarea
          placeholder="Leave feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border rounded-md mt-2"
        />
        <Button
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md"
          onClick={() => handleRatingSubmit(index)}
        >
          Submit Feedback
        </Button>
      </>
    )}
  </>
)}

          </div>
        </div>
      ))}
      {showCancelModal && (
        <Modal onClose={() => setShowCancelModal(false)}>
          <h3 className="text-xl font-bold mb-4">Cancel Reason</h3>
          <Checkbox label="Delayed Service" onChange={() => handleCheckboxChange("Delayed Service")} />
          <Checkbox label="Unsatisfactory Service" onChange={() => handleCheckboxChange("Unsatisfactory Service")} />
          <Checkbox label="Other" onChange={() => handleCheckboxChange("Other")} />
          {cancelReason.includes("Other") && (
            <Textarea
              placeholder="Enter other reason..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="mt-2 w-full p-2 border rounded-md"
            />
          )}
          <Button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleCancelSubmit}>
            Submit
          </Button>
        </Modal>
      )}
      </div>
    </div>
    </>
  );
};

export default ServicePage;
