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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${Config.API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Login Successful!", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          if (data.user_type === "customer") {
            navigate("/");
          } else if (data.user_type === "admin") {
            navigate("/order");
          } else {
            setError("Invalid user type");
          }
        }, 2500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowModal(true);
  };

  const handleGetOtp = () => {
    console.log("OTP sent to:", email);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail("");
    setOtp("");
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div
        className={`min-h-screen flex items-center justify-center bg-white relative ${
          showModal ? "blur-xs" : ""
        }`}
      >
        <div
          className="absolute inset-0 bg-white"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/white-wall.png')",
          }}
        ></div>

        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md z-10">
          <h2 className="text-3xl font-semibold text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mt-2">Sign in to continue</p>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                User Name
              </label>
              <div className="flex items-center border rounded-lg p-2 bg-gray-100">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Enter your user name"
                  className="w-full outline-none bg-transparent"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
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

            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-4">
            <span
              onClick={handleForgotPassword}
              className="text-gray-700 font-medium hover:underline cursor-pointer"
            >
              Forget Password?
            </span>
          </p>

          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-gray-700 font-medium hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleGetOtp}
              className="bg-gray-700 text-white py-2 px-4 rounded mb-4 w-full"
            >
              Get OTP
            </button>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleCloseModal}
              className="bg-gray-400 text-white py-2 px-4 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Login;
