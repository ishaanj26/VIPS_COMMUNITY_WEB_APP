import React, { useState } from "react";
import Button from '../../components/Button';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOTP = async (e) => {
    alert("here");
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ OTP sent to your email.");
        setStep(2);
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch {
      setMessage("Server error.");
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ OTP verified.");
        setStep(3);
      } else {
        setMessage(data.message || "Invalid OTP.");
      }
    } catch {
      setMessage("Server error.");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password reset successfully. You can now log in.");
        setStep(1);
      } else {
        setMessage(data.message || "Something went wrong.");
      }
      navigate("/login");
    } catch {
      setMessage("Server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={sendOTP} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
            >
              Send OTP
            </Button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={verifyOTP} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP sent to email"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition duration-200"
            >
              Verify OTP
            </Button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={resetPassword} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">New Password</label>
              <input
                type="password"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold transition duration-200"
            >
              Reset Password
            </Button>
          </form>
        )}

        {/* Message */}
        {message && (
          <div
            className={`mt-5 text-center font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
