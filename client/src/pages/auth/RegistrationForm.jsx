import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { register } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const RegistrationForm = () => {
  const initialFormData = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
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
      console.log("Error During registration", err);
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
      console.log("Error during otp validation ", err);
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // const handleRegister = async (e) => {
  //   e.preventDefault();

  //   if (!otpVerified) return alert("Please verify your email first.");
  //   if (formData.password !== formData.confirmPassword)
  //     return alert("Passwords don't match.");

  //   try {
  //     setLoading(true);
  //     const res = await axios.post("/api/v1/auth/register", formData);
  //     if (res.data.success) {
  //       alert("Registration successful!");
  //       setFormData({
  //         userName: "",
  //         email: "",
  //         password: "",
  //         confirmPassword: "",
  //       });
  //       setOtpVerified(false);
  //     } else {
  //       alert("Registration failed.");
  //     }
  //   } catch (err) {
  //     alert("Error during registration.", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!otpVerified) return alert("Please verify your email first.");
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords don't match.");
    }
    setLoading(true);
    dispatch(register(formData))
      .unwrap()
      .then((data) => {
        console.log(data);
        setLoading(false);
        toast.success(data.msg || "Registration successful");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message || "Registration failed");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleRegister}
        className=" rounded-2xl  p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-[#6a0dad] mb-6">
          <div className="text-4xl mb-2">Create Your Account</div>
          <div className="text-sm text-[#5b0d92]">
            Already have an account ?{" "}
            <Link
              to="/auth/login"
              className="underline hover:text-[#6a0dad] font-medium"
            >
              Login
            </Link>
          </div>
        </h2>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#2b2b2b]">
            User Name
          </label>
          <input
            type="text"
            name="userName"
            required
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="Enter your user name"
          />
        </div>

        <div className="mb-4">
          <label className=" font-medium mb-1 text-[#2b2b2b] flex justify-between">
            <span>Email</span>
            {otpVerified ? (
              <span className="text-green-600 text-sm">✅ Verified</span>
            ) : (
              <button
                type="button"
                onClick={handleVerifyEmail}
                className="text-[#6a0dad] text-sm underline cursor-pointer"
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
            className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
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
                  className="w-10 h-10 text-center text-xl border border-[#7635b6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleSubmitOtp}
              className="bg-[#6a0dad] text-white px-4 py-1 rounded-lg hover:bg-[#5a099a] transition duration-300"
            >
              {loading ? "Verifying..." : "Submit OTP"}
            </button>
          </div>
        )}

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#2b2b2b]">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#2b2b2b]">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#6a0dad] text-white rounded-lg font-semibold transition duration-300 disabled:opacity-60 cursor-pointer border-2 border-transparent hover:bg-[#fcfcfc] hover:text-[#6a0dad] hover:border-[#b27dd8]"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
