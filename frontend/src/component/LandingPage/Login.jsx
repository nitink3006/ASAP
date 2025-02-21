import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Navbar from "./Home/Navbar";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white" 
           style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/white-wall.png')" }}>
      </div>

      {/* Login Box */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md z-10">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-center mt-2">Sign in to continue</p>

        <form className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <div className="flex items-center border rounded-lg p-2 bg-gray-100">
              <FaUser className="text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Enter your Number" 
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Password Input with Eye Icon */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="flex items-center border rounded-lg p-2 bg-gray-100 relative">
              <FaLock className="text-gray-500 mr-2" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                className="w-full outline-none bg-transparent"
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

          {/* Login Button */}
          <button className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200">
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gray-700 font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
