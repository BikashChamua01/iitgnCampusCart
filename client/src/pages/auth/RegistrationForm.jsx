// src/pages/auth/RegistrationForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { register } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
// 📌 new import
import { validateForm } from "../../utils/validateForm";

const RegistrationForm = () => {
  const initialFormData = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);

  // 📌 new errors state
  const [errors, setErrors] = useState({});

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- UPDATED handleChange to set errors ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // run full-form validation and pick out this field
    const allErrors = validateForm({ ...formData, [name]: value });
    // also check confirmPassword match when either changes
    if (
      (name === "password" && formData.confirmPassword) ||
      name === "confirmPassword"
    ) {
      if (
        (name === "password" && formData.confirmPassword !== value) ||
        (name === "confirmPassword" && value !== formData.password)
      ) {
        allErrors.confirmPassword = "Passwords must match";
      } else {
        delete allErrors.confirmPassword;
      }
    }
    setErrors(allErrors);
  };

  // --- OTP handlers unchanged ---
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

  // --- UPDATED handleRegister to block if errors exist ---
  const handleRegister = async (e) => {
    e.preventDefault();

    // run full-form validation
    const formErrors = validateForm(formData);
    // confirm password match
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords must match";
    }
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    if (!otpVerified) return alert("Please verify your email first.");
    setLoading(true);

    dispatch(register(formData))
      .unwrap()
      .then((data) => {
        console.log("Hello this is inside then", data);
        setLoading(false);
        toast.success(data.msg || "Registration successful");
      })
      .catch((error) => {
        setLoading(false);
        const errMsg = error?.msg || error?.message || "Registration failed";
        toast.error(errMsg);
      });
  };

const genders = ["","Male","Female"];
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleRegister}
        className="rounded-2xl p-8 w-full max-w-md"
      >
        {/* ... header omitted for brevity ... */}

        {/* User Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#2b2b2b]">
            User Name
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="Enter your user name"
          />
          {errors.userName && (
            <p className="text-red-600 mt-1">{errors.userName}</p>
          )}
        </div>

        {/* Email + Verify */}
        <div className="mb-4">
          <label className="font-medium mb-1 text-[#2b2b2b] flex justify-between">
            <span>Email</span>
            {!otpVerified && (
              <button
                type="button"
                onClick={handleVerifyEmail}
                className="text-[#6a0dad] text-sm underline cursor-pointer"
                disabled={!formData.email || loading || !!errors.email}
              >
                {loading ? "Sending..." : "Verify"}
              </button>
            )}
            {otpVerified && (
              <span className="text-green-600 text-sm">✅ Verified</span>
            )}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-600 mt-1">{errors.email}</p>}
        </div>

        {/* OTP Inputs */}
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
        {/* phone Number */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#2b2b2b]">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="Enter your Phone Number"
          />
          {errors.phoneNumber && (
            <p className="text-red-600 mt-1">{errors.phoneNumber}</p>
          )}
        </div>
        {/* gender */}
      <div className="mb-4">
          <label className="block font-medium mb-1 text-[#2b2b2b]">
        <span className="text-[#2b2b2b] font-medium">Gender</span>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          // className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
           className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
        >
          {genders.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      </div>

      
      

        {/* Password */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#2b2b2b]">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#2b2b2b]">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit */}
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
