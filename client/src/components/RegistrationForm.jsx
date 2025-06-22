import React, { useState } from "react";
import styled from "styled-components";
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
      alert("Failed to send OTP. Try again.", err);
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
      alert("Verification failed.", err);
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
      console.log("hello");
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
      if (err.response?.status === 409) {
        alert(err.response.data?.msg || "User already exists.");
      } else {
        alert("Error during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper>
      <FormBox onSubmit={handleRegister}>
        <Title>Student Registration</Title>

        <InputBox>
          <label>User Name</label>
          <input
            type="text"
            required
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your user name"
          />
        </InputBox>

        <InputBox>
          <label>
            Email{" "}
            {otpVerified ? (
              <VerifiedTag>✅ Verified</VerifiedTag>
            ) : (
              <Verify
                type="button"
                onClick={handleVerifyEmail}
                disabled={!formData.email || loading}
              >
                {loading ? "Sending..." : "Verify"}
              </Verify>
            )}
          </label>
          <input
            type="email"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </InputBox>

        {showOtpInput && !otpVerified && (
          <OtpWrapper>
            <OtpMessage>Enter the 6-digit OTP sent to your email</OtpMessage>
            <OtpInputs>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                />
              ))}
            </OtpInputs>
            <OtpButton type="button" onClick={handleSubmitOtp}>
              {loading ? "Verifying..." : "Submit OTP"}
            </OtpButton>
          </OtpWrapper>
        )}

        <InputBox>
          <label>Password</label>
          <input
            type="password"
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </InputBox>

        <InputBox>
          <label>Confirm Password</label>
          <input
            type="password"
            required
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
        </InputBox>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </SubmitButton>
      </FormBox>
    </FormWrapper>
  );
};

export const FormWrapper = styled.div`
  min-height: 80vh;
  padding: 1vw;
  width: 100vw;
  background: linear-gradient(135deg, #e0e7ff 0%, rgb(235, 236, 228) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const FormBox = styled.form`
  background: rgba(255, 255, 255, 0.9);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(30, 144, 255, 0.1),
    0 1.5px 6px rgba(0, 0, 0, 0.03);
  width: 100%;
  max-width: 500px;
  transition: box-shadow 0.3s;
  backdrop-filter: blur(4px);

  &:hover {
    box-shadow: 0 12px 40px rgba(30, 144, 255, 0.13),
      0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;
export const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #2563eb;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 1px;
`;
export const InputBox = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
    font-weight: 600;
    color: #1e293b;
    font-size: 1rem;
    letter-spacing: 0.2px;
  }

  input {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    background: #f8fafc;
    font-size: 1rem;
    color: #22223b;
    transition: border 0.2s, box-shadow 0.2s;
    outline: none;
    box-shadow: 0 1px 2px rgba(30, 144, 255, 0.02);

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 2px 8px rgba(30, 144, 255, 0.1);
      background: #fff;
    }
  }
`;
export const Verify = styled.button`
  font-size: 0.88rem;
  background: linear-gradient(90deg, #2563eb 60%, #38bdf8 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 14px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(30, 144, 255, 0.1);
  transition: background 0.2s, box-shadow 0.2s;

  &:hover:enabled {
    background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
    box-shadow: 0 2px 8px rgba(30, 144, 255, 0.13);
  }

  &:disabled {
    background: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
export const VerifiedTag = styled.span`
  font-size: 0.9rem;
  color: #22c55e;
  font-weight: 600;
  background: #e7fbe9;
  padding: 2px 10px;
  border-radius: 5px;
  letter-spacing: 0.5px;
`;
export const OtpWrapper = styled.div`
  margin-bottom: 1.8rem;
  animation: fadeIn 0.5s;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
export const OtpMessage = styled.p`
  font-size: 0.97rem;
  margin-bottom: 12px;
  color: #475569;
  font-weight: 500;
  text-align: center;
`;
export const OtpInputs = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 10px;

  input {
    width: 2.5rem;
    height: 2.5rem;
    text-align: center;
    font-size: 1.3rem;
    border: 1.5px solid #e0e7ff;
    border-radius: 8px;
    background: #f1f5f9;
    color: #2563eb;
    font-weight: 700;
    transition: border 0.2s, background 0.2s;

    &:focus {
      border-color: #2563eb;
      background: #fff;
    }
  }
`;
export const OtpButton = styled.button`
  display: block;
  margin: 0 auto;
  background: linear-gradient(90deg, #2563eb 60%, #38bdf8 100%);
  color: white;
  border: none;
  padding: 8px 28px;
  font-size: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 4px rgba(30, 144, 255, 0.1);
  transition: background 0.2s, box-shadow 0.2s;

  &:hover:enabled {
    background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
    box-shadow: 0 2px 8px rgba(30, 144, 255, 0.13);
  }

  &:disabled {
    background: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
export const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #2563eb 60%, #38bdf8 100%);
  color: white;
  border: none;
  padding: 12px 0;
  font-size: 1.08rem;
  border-radius: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(30, 144, 255, 0.1);
  margin-top: 0.8rem;
  transition: background 0.2s, box-shadow 0.2s;

  &:hover:enabled {
    background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
    box-shadow: 0 4px 16px rgba(30, 144, 255, 0.13);
  }

  &:disabled {
    background: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export default RegistrationForm;
