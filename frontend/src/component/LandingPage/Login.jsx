import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Navbar from "./Home/Navbar";
import Footer from "./Home/Footer";
import Config from "../../Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState('admin');
  const navigate = useNavigate();

  const handleEmailChange = async (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    if (emailInput.includes("@")) {
      try {
        // const response = await fetch(`${Config.API_URL}/check-user-type`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ email: emailInput }),
        // });
        // const data = await response.json();
        setUserType('admin');

        // if (response.ok) {
        //   setUserType(data.user_type);
        // }
      } catch (err) {
        setError("Failed to check user type");
      }
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${Config.API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Login Successful!", { position: "top-right", autoClose: 1000 });
        setTimeout(() => {
          navigate(data.user_type === "admin" ? "/order" : "/");
        }, 2500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    toast.info("OTP sent to your email", { position: "top-right", autoClose: 1000 });
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-center mt-2">Sign in to continue</p>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <div className="flex items-center border rounded-lg p-2 bg-gray-100">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="w-full outline-none bg-transparent"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
            </div>

            {userType === "admin" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <div className="flex items-center border rounded-lg p-2 bg-gray-100 relative">
                  <FaLock className="text-gray-500 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full outline-none bg-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            )}

            {userType === "user" ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200"
              >
                Send OTP
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            )}
          </form>

          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gray-700 font-medium hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
