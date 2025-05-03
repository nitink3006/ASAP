import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdMyLocation } from "react-icons/md";
import Footer from "./Home/Footer";
import Config from "../../Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Navbar from "./Home/Navbar";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
import firebaseApp from "../../firebase";
 
const Signup = () => {
  const navigate = useNavigate();
  const [phoneVerified, setPhoneVerified] = useState(false);
const [emailVerified, setEmailVerified] = useState(false);
const [otp, setOtp] = useState("");
const [emailOtp, setEmailOtp] = useState("");
const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
const [confirmationResult, setConfirmationResult] = useState(null);
const [loading, setLoading] = useState(false); // or isSendingPhoneOtp, isSendingEmailOtp

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    flat_building: "",
    landmark: "",
    city: "",
    pincode: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.address) {
            setFormData((prev) => ({
              ...prev,
              address: data.address.road || "",
              landmark: data.address.suburb || "",
              city: data.address.city || data.address.town || data.address.village || "",
              pincode: data.address.postcode || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      console.log("Setting up recaptcha...");
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("ReCAPTCHA verified"),
        }
      );
    }
  };
  
  
  const handleSendOtp = async () => {
    if (!/^[2-9]{1}[0-9]{9}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }
    
    try {
      setLoading(true);
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
    
      const confirmation = await signInWithPhoneNumber(
        auth, `+1${formData.phone}`,
        appVerifier
      );
      setConfirmationResult(confirmation);
      toast.info("OTP sent to your phone.");
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error(`Failed to send OTP: ${err.message}`);
    } finally {
      setLoading(false);
    }
    
  };
  
  
   const handleVerifyOtp = async () => {
     if (!otp) {
       toast.error("Enter OTP.");
       return;
     }
 
     try {
       setLoading(true);
       await confirmationResult.confirm(otp);
       setPhoneVerified(true);
       toast.success("Phone verified successfully!");
      //  await handleLogin({ preventDefault: () => {} });
     } catch (err) {
       toast.error("Invalid OTP.");
      console.log("Error verifying OTP:", err);
     } finally {
       setLoading(false);
     }
   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneVerified || !emailVerified) {
      toast.error("Please verify your phone number and email before signing up.");
      return;
    }    

    try {
      const response = await fetch(`${Config.API_URL}/user-profiles/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        if (response.ok) {
          localStorage.setItem("user", JSON.stringify(data));
          toast.success("Signup Successful!", { position: "top-right", autoClose: 1000 });
          setTimeout(() => {
            if (data.user_type === "customer") {
              navigate("/");
            } else if (data.user_type === "owner") {
              navigate("/order");
            } else {
              setError("Invalid user type");
            }
          }, 2500);
        }
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handleVerifyEmailOtp = () => {
    if (emailOtp.length === 6) {
      setEmailVerified(true);
      toast.success("Email verified!");
    } else {
      toast.error("Invalid Email OTP");
    }
  };
  
  const handleSendEmailOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Enter a valid email.");
      return;
    }
  
    try {
      setLoading(true);
      const res = await fetch(`${Config.API_URL}/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
  
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to your email.");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error("Error sending email OTP.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
          <Navbar />
          <ToastContainer />
          <div className="min-h-screen flex items-center justify-center bg-white relative">
  <div className="absolute inset-0 bg-white" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/white-wall.png')" }}></div>

  <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl z-10 mt-20">
    <h2 className="text-3xl font-semibold text-center text-gray-800">Create Account</h2>
    <p className="text-gray-500 text-center mt-2">Sign up to get doorstep services</p>

    <form className="mt-6" onSubmit={handleSubmit}>
  {/* Full Name & Pincode */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700 font-medium mb-2">Full Name</label>
      <div className="flex items-center border rounded-lg p-2 bg-gray-100">
        <FaUser className="text-gray-500 mr-2" />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="w-full outline-none bg-transparent"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Pincode</label>
      <div className="flex items-center border rounded-lg p-2 bg-gray-100">
        <input
          type="number"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter Pincode"
          className="w-full outline-none bg-transparent"
          required
        />
      </div>
    </div>
  </div>

  {/* Address Fields */}
  <div className="grid grid-cols-2 gap-4 mt-4">
    <div className="relative">
      <label className="block text-gray-700 font-medium mb-2">Address</label>
      <div className="flex items-center border rounded-lg p-2 bg-gray-100 relative">
        <FaMapMarkerAlt className="text-gray-500 mr-2" />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full outline-none bg-transparent"
          required
        />
        <MdMyLocation
          className="absolute right-3 text-blue-600 cursor-pointer"
          onClick={getLocation}
          title="Use Current Location"
        />
      </div>
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Flat / Building Name</label>
      <input
        type="text"
        name="flat_building"
        value={formData.flat_building}
        onChange={handleChange}
        placeholder="Flat / Building Name"
        className="w-full border rounded-lg p-2 bg-gray-100 outline-none"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Landmark</label>
      <input
        type="text"
        name="landmark"
        value={formData.landmark}
        onChange={handleChange}
        placeholder="Nearby Landmark"
        className="w-full border rounded-lg p-2 bg-gray-100 outline-none"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">City</label>
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="Enter your city"
        className="w-full border rounded-lg p-2 bg-gray-100 outline-none"
        required
      />
    </div>
  </div>

  {/* Phone Number & OTP Verification */}
  <div className="mt-4">
  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
  <div className="flex flex-wrap items-center gap-5">
    {/* Phone Input */}
    <div className={`flex items-center border rounded-lg p-2 ${phoneVerified ? "bg-green-100" : "bg-gray-100"}`}>
      <FaPhone className="text-gray-500 mr-2" />
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter your number"
        className="w-36 outline-none bg-transparent"
        disabled={phoneVerified}
        required
      />
    </div>

    {/* Show OTP & buttons only if not verified */}
    {!phoneVerified && (
      <>
        {/* Send OTP Button */}
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={isSendingPhoneOtp || formData.phone.length !== 10}
          className={`text-sm px-3 py-2 rounded ${
            isSendingPhoneOtp || formData.phone.length !== 10
              ? "bg-gray-500 text-white cursor-pointer"
              : "bg-gray-700 text-white cursor-pointer"
          }`}
        >
          {isSendingPhoneOtp ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* OTP Input and Verify Button */}
        <div className="flex ml-12 gap-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="border border-gray-300 rounded px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={!otp}
            className={`px-3 py-2 rounded text-white cursor-pointer ${
              otp ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Verify
          </button>
        </div>
      </>
    )}
  </div>
</div>



  {/* Email OTP Verification */}
  <div className="mt-4">
  <label className="block text-gray-700 font-medium mb-2">Email</label>
  <div className="flex flex-wrap items-center gap-2">
    {/* Email Input */}
    <div className={`flex items-center border rounded-lg p-2 ${emailVerified ? "bg-green-100" : "bg-gray-100"}`}>
      <input
        type="text"
        placeholder="Enter your email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-48 bg-transparent outline-none"
        disabled={emailVerified}
      />
    </div>

    {/* Buttons visible only if not verified */}
    {!emailVerified && (
      <>
        <button
          type="button"
          onClick={handleSendEmailOtp}
          disabled={isSendingEmailOtp}
          className={`text-sm px-3 py-2 rounded ${
            isSendingEmailOtp
              ? "bg-gray-400 text-white cursor-pointer"
              : "bg-gray-700 text-white cursor-pointer"
          }`}
        >
          {isSendingEmailOtp ? "Sending OTP..." : "Send OTP"}
        </button>

        <div className="flex ml-12 gap-2">
          <input
            type="text"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="border border-gray-300 rounded px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            type="button"
            onClick={handleVerifyEmailOtp}
            disabled={emailOtp.length !== 6}
            className={`px-3 py-2 rounded text-white cursor-pointer ${
              emailOtp.length === 6 ? "bg-gray-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Verify
          </button>
        </div>
      </>
    )}
  </div>
</div>



  {/* Submit Button */}
  <button
    className="w-full cursor-pointer bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 mt-6"
    type="submit"
  >
    Create Account
  </button>
</form>


    <p className="text-center text-gray-500 mt-4">
      Already have an account?{" "}
      <Link to="/login" className="text-gray-700 cursor-pointer font-medium hover:underline">
        Login
      </Link>
    </p>
  </div>
</div>

      <Footer />
      <div id="recaptcha-container"></div>

    </>
  );
};

export default Signup;
