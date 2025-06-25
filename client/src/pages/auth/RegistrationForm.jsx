import React, { useState } from "react";
import axios from "axios";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVerifyEmail = async () => {
    if (!formData.email) return alert("Please enter your email");

    try {
      setLoading(true);
      const response = await axios.post("/api/v1/auth/send-code", {
        email: formData.email,
      });
      if (response?.data?.alreadyVerified) {
        setLoading(false);
        setOtpVerified(true);
        setShowOtpInput(false);
        return alert("Email already verified");
      }
      setShowOtpInput(true);
      alert("OTP sent to your email.");
    } catch (err) {
      alert("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmitOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) return alert("Please enter 6 digits.");

    try {
      setLoading(true);
      const res = await axios.post("/api/v1/auth/verify-code", {
        email: formData.email,
        code: fullOtp,
      });

      if (res.data?.success) {
        setOtpVerified(true);
        setShowOtpInput(false);
        alert(res.data.msg);
      } else {
        alert(res.data.msg || "Invalid code.");
      }
    } catch (err) {
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!otpVerified) return alert("Please verify your email first.");
    if (formData.password !== formData.confirmPassword)
      return alert("Passwords don't match.");

    try {
      setLoading(true);
      const res = await axios.post("/api/v1/auth/register", formData);
      if (res.data.success) {
        alert("Registration successful!");
        setFormData({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setOtpVerified(false);
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      alert("Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-cream-100 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Student Registration
        </h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">User Name</label>
          <input
            type="text"
            name="userName"
            required
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your user name"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1 flex justify-between">
            <span>Email</span>
            {otpVerified ? (
              <span className="text-green-600 text-sm">✅ Verified</span>
            ) : (
              <button
                type="button"
                onClick={handleVerifyEmail}
                className="text-blue-600 text-sm underline"
                disabled={!formData.email || loading}
              >
                {loading ? "Sending..." : "Verify"}
              </button>
            )}
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
          />
        </div>

        {showOtpInput && !otpVerified && (
          <div className="mb-4 text-center">
            <p className="text-gray-600 mb-2">Enter the 6-digit OTP</p>
            <div className="flex justify-center space-x-2 mb-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-10 h-10 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleSubmitOtp}
              className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Verifying..." : "Submit OTP"}
            </button>
          </div>
        )}

        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
