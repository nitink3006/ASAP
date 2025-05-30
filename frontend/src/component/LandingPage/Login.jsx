import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Navbar from "./Home/Navbar";
import Footer from "./Home/Footer";
import Config from "../../Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
import firebaseApp from "../../firebase";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState(null);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const input = e.target.value;
    setEmailOrPhone(input);
  
    if (input.toLowerCase() === "admin@gmail.com") {
      setUserType("admin");
      setError("");
    } else if (/^\d{10}$/.test(input)) {
      setUserType("phone");
      setError("");
    } else if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)){
      setUserType("email");
      setError("");
    }
    else {
      setUserType(null);
      setError("Kindly enter valid email or phone number.");
    }
  };
  
  const handleSendEmailOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone)) {
      toast.error("Enter a valid email.");
      return;
    }
  
    try {
      setLoading(true);
      const res = await fetch(`${Config.API_URL}/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone }),
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
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${Config.API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: emailOrPhone,
          password: userType === "admin" ? password : "none",
          otp: userType === "email" ? otp : "none",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Login Successful!", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate(data.user_type === "admin" ? "/order" : "/");
        }, 2500);
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
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
    if (!/^[2-9]{1}[0-9]{9}$/.test(emailOrPhone)) {
      toast.error("Enter a valid 10-digit US phone number.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${Config.API_URL}/check-user/?mobile_no=${emailOrPhone}`);
      const userData = await res.json();

      if (!res.ok || userData.status === "False") {
        toast.error("User does not exist.");
        setLoading(false);
        return;
      }

      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,`+1${emailOrPhone}`,
        appVerifier
      );
      setConfirmationResult(confirmation);
      toast.info("OTP sent to your phone.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP.");
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
      toast.success("Phone verified successfully!");
      await handleLogin({ preventDefault: () => {} });
    } catch (err) {
      toast.error("Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      
      <div className="min-h-screen flex items-center justify-center bg-white relative">
      <div
          className="absolute inset-0 bg-white"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/white-wall.png')" }}
        ></div>
        <div className="bg-white p-8 rounded-lg z-10 shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mt-2">LogIn to continue</p>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <form
            className="mt-6"
            onSubmit={
              userType === "admin" ? handleLogin : (e) => e.preventDefault()
            }
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Phone/Email
              </label>
              <div className="flex items-center border rounded-lg p-2 bg-gray-100">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Enter your phone Number or Email"
                  className="w-full outline-none bg-transparent"
                  value={emailOrPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {emailOrPhone.toLowerCase() === "admin@gmail.com" && (
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
            )}

{userType === "phone" && !confirmationResult && (
  <button
    type="button"
    onClick={handleSendOtp}
    className="w-full bg-gray-700 text-white py-2 mt-2 rounded-lg cursor-pointer"
  >
    {loading ? "Sending OTP..." : "Send OTP to Phone"}
  </button>
)}

{userType === "email" && !confirmationResult && (
  <button
    type="button"
    onClick={handleSendEmailOtp}
    className="w-full bg-gray-700 text-white py-2 mt-2 rounded-lg cursor-pointer"
  >
    {loading ? "Sending OTP..." : "Send OTP to Email"}
  </button>
)}

{(userType === "phone" || userType === "email") && (
  <div className="mt-4">
    <label className="block text-gray-700 font-medium mb-2">
      Enter OTP
    </label>
    <input
      type="text"
      className="w-full border rounded-lg p-2 bg-gray-100 outline-none"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
    <button
      type="button"
      onClick={
        userType === "phone" ? handleVerifyOtp : async () => {
          await handleLogin({ preventDefault: () => {} });
        }
      }
      className="w-full bg-gray-700 text-white py-2 mt-4 rounded-lg cursor-pointer"
      disabled={loading}
    >
      {loading ? "Verifying..." : "Verify OTP"}
    </button>
  </div>
)}

            {userType === "admin" && (
              <button
                type="submit"
                className="w-full bg-gray-700 text-white py-2 rounded-lg cursor-pointer font-semibold hover:bg-gray-800 transition duration-200"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            )}
          </form>

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
      <Footer />
      <div id="recaptcha-container"></div>
    </>
  );
};

export default Login;
