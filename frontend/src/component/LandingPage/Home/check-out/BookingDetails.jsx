import { useState, useEffect } from "react";
import { MapPin, Clock, CreditCard } from "lucide-react";
import Config from "../../../../Config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookingDetails = ({ totalAmount, selectedServices }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
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
    
    // Load Razorpay script with improved error handling
    useEffect(() => {
        const loadRazorpayScript = () => {
            if (window.Razorpay) {
                setRazorpayLoaded(true);
                return Promise.resolve(true);
            }
            
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => {
                    setRazorpayLoaded(true);
                    resolve(true);
                };
                script.onerror = () => {
                    console.error("Razorpay script failed to load");
                    toast.error("Payment gateway failed to load. Please try again later.");
                    setRazorpayLoaded(false);
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        };
        
        loadRazorpayScript();
        
        // Cleanup function to remove script when component unmounts
        return () => {
            const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
            if (existingScript && existingScript.parentNode) {
                existingScript.parentNode.removeChild(existingScript);
            }
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        // Form validation
        const requiredFields = ['name', 'phone', 'email', 'address', 'city', 'pincode', 'preferred_time', 'payment_method', 'flat_building', 'landmark'];
        const missingFields = [];
        
        for (const field of requiredFields) {
            if (!formData[field]) {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            toast.error(`Please fill in the following fields: ${missingFields.join(', ').replace(/_/g, ' ')}`);
            return false;
        }
        
        if (!selectedServices || selectedServices.length === 0) {
            toast.error("No services selected");
            return false;
        }
        
        return true;
    };

    // Only create a Razorpay order, don't create booking yet
    const createRazorpayOrder = async () => {
        try {
            // Prepare service data for the API
            const service = (selectedServices || []).map((item) => ({
                name: item.service.name,
                price: item.service.price,
                id: item.id,
                images: item.service.images,
                quantity: item.quantity || 1,
            }));
            
            console.log("Creating Razorpay order for:", {
                total_amount,
                currency: "USD"
            });
            
            // Only make API call to create Razorpay order, not booking
            const orderResponse = await fetch(`${Config.API_URL}/create-order/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    amount: total_amount*100,
                    currency: "USD"
                }),
            });

            const responseData = await orderResponse.json();
            
            if (!orderResponse.ok) {
                const errorMessage = typeof responseData === 'object' 
                    ? Object.entries(responseData).map(([key, value]) => `${key}: ${value}`).join(', ')
                    : "Failed to create payment order";
                throw new Error(errorMessage);
            }

            console.log("Order created successfully:", responseData);
            return responseData;
        } catch (error) {
            console.error("Order creation error:", error);
            toast.error(`Failed to create order: ${error.message}`);
            throw error;
        }
    };

    // Main payment handling function
    const handlePayment = async () => {
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            if (formData.payment_method === "COD") {
                // For Cash on Delivery, directly create booking
                await createBooking({ payment_method: "COD", status: "pending" });
            } else if (formData.payment_method === "UPI" || formData.payment_method === "Card") {
                // Check if Razorpay is loaded
                if (!window.Razorpay) {
                    toast.error("Payment gateway is not available. Please try again later.");
                    setIsLoading(false);
                    return;
                }
                
                // Step 1: Create Razorpay order only
                const orderData = await createRazorpayOrder();
                
                if (!orderData || !orderData.id) {
                    throw new Error("Invalid order data received from server");
                }
                
                // Step 2: Initialize Razorpay
                const razorpayOptions = {
                    key: "rzp_test_t5pERdaHWqt4D9", // Your Razorpay key
                    amount: total_amount * 100, // Razorpay expects amount in paise
                    currency: "USD",
                    name: "Service Booking",
                    description: "Service Booking Payment",
                    order_id: orderData.id,
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone,
                    },
                    handler: async function (response) {
                        try {
                            // Step 3: Only create booking after payment is successful
                            await handlePaymentSuccess(response);
                        } catch (error) {
                            console.error("Payment handling error:", error);
                            toast.error(`Payment processing failed: ${error.message}`);
                            setIsLoading(false);
                        }
                    },
                    modal: {
                        ondismiss: function() {
                            setIsLoading(false);
                            toast.info("Payment cancelled by user");
                        }
                    },
                    theme: {
                        color: "#7B41E6",
                    },
                };
                
                console.log("Initializing Razorpay with options:", razorpayOptions);
                
                // Open Razorpay checkout
                const razorpay = new window.Razorpay(razorpayOptions);
                try {
                    razorpay.open();
                } catch (error) {
                    console.error("Razorpay open error:", error);
                    toast.error("Failed to open payment gateway. Please try again.");
                    setIsLoading(false);
                }
            } else {
                toast.error("Please select a payment method");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Payment processing error:", error);
            toast.error(`Payment failed: ${error.message}`);
            setIsLoading(false);
        }
    };

    // Handle successful payment with verification and booking creation
    const handlePaymentSuccess = async (paymentResponse) => {
        try {
            console.log("Payment successful. Verifying payment:", paymentResponse);
            
            // Verify payment with backend
            const verifyResponse = await fetch(`${Config.API_URL}/verify-payment/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_signature: paymentResponse.razorpay_signature
                }),
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyResponse.ok && verifyData.status === "Payment Verified") {
                console.log("Payment verified successfully:", verifyData);
                
                // Only create booking after payment is verified
                await createBooking({
                    payment_id: paymentResponse.razorpay_payment_id,
                    order_id: paymentResponse.razorpay_order_id,
                    signature: paymentResponse.razorpay_signature,
                    status: "completed",
                    payment_method: formData.payment_method
                });
            } else {
                const errorMessage = typeof verifyData === 'object' 
                    ? Object.entries(verifyData).map(([key, value]) => `${key}: ${value}`).join(', ')
                    : "Payment verification failed";
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(`Payment verification failed: ${error.message}`);
            setIsLoading(false);
        }
    };

    // Create booking only after payment completion
    const createBooking = async (paymentData = null) => {
        try {
            if (!validateForm()) {
                return;
            }
    
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
                payment_details: paymentData
            };
    
            console.log("Creating booking with payload:", payload);
    
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
                const errorMessage = typeof data === 'object' 
                    ? Object.entries(data).map(([key, value]) => `${key}: ${value}`).join(', ')
                    : "Booking failed";
                throw new Error(errorMessage);
            }
    
            console.log("Booking created successfully:", data);
            setShowSuccessModal(true);
            setIsLoading(false);
        } catch (error) {
            toast.error(`Order confirmation failed: ${error.message}`);
            console.error("Booking error:", error);
            setIsLoading(false);
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
                                Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone *
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Flat / Building *
                            </label>
                            <input
                                type="text"
                                name="flat_building"
                                value={formData.flat_building}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Landmark *
                            </label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                City *
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Pincode *
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* preferred_time Selection & payment_method */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Clock size={16} />
                                SLOT *
                            </label>
                            <input
                                type="time"
                                name="preferred_time"
                                value={formData.preferred_time}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <CreditCard size={16} />
                                Payment Method *
                            </label>
                            <select
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                required
                            >
                                <option value="">Select</option>
                                <option value="COD">Cash on Delivery</option>
                                <option value="UPI">Pay Online with UPI</option>
                                <option value="Card">Pay Online with Card</option>
                            </select>
                            {(formData.payment_method === "UPI" || formData.payment_method === "Card") && 
                             !razorpayLoaded && 
                             <p className="text-yellow-600 text-xs mt-1">
                                Payment gateway is loading. Please wait a moment.
                             </p>
                            }
                        </div>
                    </div>

                    {/* Services Selected */}
                    <div className="pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-2">Services Selected</h4>
                        {selectedServices && selectedServices.length > 0 ? (
                            <ul className="text-sm">
                                {selectedServices.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center mb-1">
                                        <span>{item.service.name} x {item.quantity || 1}</span>
                                        <span>${item.service.price * (item.quantity || 1)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-red-500 text-sm">No services selected</p>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-2">Order Summary</h4>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Amount:</span>
                            <span className="font-semibold">${total_amount}</span>
                        </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-1">
                            Cancellation Policy
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                            Free cancellations if done more than 3 hrs before
                            the service or if a professional isn't assigned. A
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
                            onClick={handlePayment}
                            disabled={isLoading || ((formData.payment_method === "UPI" || formData.payment_method === "Card") && !razorpayLoaded)}
                        >
                            {isLoading ? "Processing..." : "Confirm Booking"}
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <h2 className="text-xl font-bold">Account</h2>
                    <p className="text-gray-600 mt-2">
                        To book the service, please login or sign up
                    </p>
                    <button 
                        className="w-full mt-4 bg-[#7B41E6] text-white py-2 rounded-md font-semibold hover:bg-[#6734c2] transition"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>
            )}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-2">
                            Payment Successful!
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