import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdMyLocation } from "react-icons/md";
import Footer from "./Home/Footer";
import Config from "../../Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    flat_building: "",
    landmark: "",
    city: "",
    pincode: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
            } else if (data.user_type === "admin") {
              navigate("/dashboard");
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

  return (
    <>
          <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-white relative">
        <div
          className="absolute inset-0 bg-white"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/white-wall.png')" }}
        ></div>

        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl z-10 mt-18">
          <h2 className="text-3xl font-semibold text-center text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-center mt-2">Sign up to get doorstep services</p>

          <form className="mt-6" onSubmit={handleSubmit}>
            {/* Full Name & Phone Number */}
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
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <div className="flex items-center border rounded-lg p-2 bg-gray-100">
                  <FaPhone className="text-gray-500 mr-2" />
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
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

              <div>
                <label className="block text-gray-700 font-medium mb-2">Pincode</label>
                <input
                  type="number"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter Pincode"
                  className="w-full border rounded-lg p-2 bg-gray-100 outline-none"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <div className="flex items-center border rounded-lg p-2 bg-gray-100 relative">
                  <FaLock className="text-gray-500 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full outline-none bg-transparent"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full cursor-pointer bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 mt-4" type="submit">
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4 ">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-700 cursor-pointer font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
