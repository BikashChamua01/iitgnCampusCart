// src/pages/auth/RegistrationForm.jsx
import React, { useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { register } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { validateForm } from "../../utils/validateForm";
import getCroppedImg from "@/components/shop/cropImage";

// Import react-easy-crop for cropping UI
import Cropper from "react-easy-crop";
import { Images } from "lucide-react";

const RegistrationForm = () => {
  const initialFormData = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    profilePhoto: "",
  };
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for image cropping
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImageURL, setCroppedImageURL] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  // Handle form input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const allErrors = validateForm({ ...formData, [name]: value }, "register");

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

  // OTP handlers (unchanged)
  const handleVerifyEmail = async () => {
    if (!formData.email) return alert("Please enter your email");

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/send-code`,
        {
          email: formData.email,
        }
      );
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
      toast.error(err?.response?.data?.msg || "Failed to send OTP. Try again.");
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
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/verify-code`,
        {
          email: formData.email,
          code: fullOtp,
        }
      );

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
      toast.error(err?.response?.data?.msg || "Verification failed" );
    } finally {
      setLoading(false);
    }
  };

  // Handle cropping complete event
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Handle file input change for profile photo
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setCroppedImageURL(null);
      // setCroppedFile(null);
    }
  };

  // Utility to read file as data URL
  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.readAsDataURL(file);
    });
  };

  // Generate cropped image and store file and preview URL
  const showCroppedImage = useCallback(async () => {
    try {
      const { blob, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImageURL(url);
      const file = new File([blob], "avatar.jpg", { type: blob.type });

      setCroppedFile(file);
      setImageSrc(null); // Close cropper UI after cropping
    } catch (e) {
      console.error(e);
      alert("Failed to crop image.");
      toast.error(e?.response?.data?.msg || "Failed to crop immage" );
    }
  }, [imageSrc, croppedAreaPixels]);

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    const formErrors = validateForm(formData, "register");
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords must match";
    }
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    if (!otpVerified) return alert("Please verify your email first.");
    setLoading(true);

    // Prepare form data including cropped profile photo if available
    const submissionData = new FormData();
    submissionData.append("userName", formData.userName);
    submissionData.append("email", formData.email);
    submissionData.append("password", formData.password);
    submissionData.append("confirmPassword", formData.confirmPassword);
    submissionData.append("phoneNumber", formData.phoneNumber);
    submissionData.append("gender", formData.gender);
    if (croppedFile) {
      submissionData.append("images", croppedFile);
    }

    //  console.log(submissionData);

    dispatch(register(submissionData))
      .unwrap()
      .then((data) => {
        setLoading(false);
        toast.success(data.msg || "Registration successful");
      })
      .catch((error) => {
        setLoading(false);
        const errMsg =
          error?.response?.data?.msg || error?.message || "Registration failed";
        toast.error(errMsg);
      });
  };

  const genders = ["", "Male", "Female"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <form
        onSubmit={handleRegister}
        className="rounded-2xl p-8 w-full max-w-md h-screen overflow-y-scroll md:h-auto md:overflow-y-hidden "
      >
        {/* ... other form fields ... */}
        <h2 className="text-2xl font-bold text-center text-[#6a0dad] mb-6">
          <div className="text-4xl mb-2">Create You Account</div>
          <div className="text-sm text-[#5b0d92]">
            Already have an account ?{" "}
            <Link
              to="/auth/login"
              className="underline hover:text-[#6a0dad] font-medium"
            >
              login
            </Link>
          </div>
        </h2>

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
              {otp?.map((digit, idx) => (
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
        {/* Phone Number  + Gender*/}
        <div className="flex flex-col md:flex-row mb-4 justify-between">
          {/* Phone Number */}
          <div className="mb-4 md:mb-0">
            <label className="block font-medium  text-[#2b2b2b]">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
              placeholder="Enter Phone Number"
            />
            {errors.phoneNumber && (
              <p className="text-red-600 mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Gender */}
          <div className="mb-4 md:mb-0">
            <label className="block font-medium  text-[#2b2b2b]">
              <span className="text-[#2b2b2b] font-medium">Gender</span>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
              >
                {genders?.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Profile Photo Upload */}
        <div className="mb-4">
          <label className="block font-medium  text-[#2b2b2b]">
            Profile Photo
          </label>
          {!imageSrc && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-[#7635b6] rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
              />
              {croppedImageURL && (
                <div className="mt-2 max-w-[150px] aspect-square overflow-hidden rounded-full border border-[#7635b6]">
                  <img
                    src={croppedImageURL}
                    alt="Cropped"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </>
          )}

          {/* Cropper UI */}
          {imageSrc && (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          {/* Crop and Cancel buttons */}
          {imageSrc && (
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={showCroppedImage}
                className="bg-[#6a0dad] text-white px-4 py-2 rounded-lg hover:bg-[#5a099a] transition duration-300"
              >
                Crop Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageSrc(null);
                  setCroppedImageURL(null);
                  // setCroppedFile(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {/* Password +confirm password */}
        <div className="flex mb-4 flex-col md:flex-row justify-between">
          {/* Password */}
          <div className="mb-4 md:mb-0">
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
          <div className="mb-4  md:mb-0 md:ml-1">
            <label className="block font-medium mb-1 text-[#2b2b2b]">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-1 py-2  border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
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
