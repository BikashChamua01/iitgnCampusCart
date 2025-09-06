// src/components/LoginForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return alert("Please fill in all fields.");

    setLoading(true);

    dispatch(login(formData))
      .unwrap()
      .then((data) => {
        if (data.success) {
          toast.success("Successfully logged in");
        } else {
          toast.error(data.msg || "Failed to login");
        }
        setLoading(false); // ✅ Move here
      })
      .catch((error) => {
        toast.error(error?.response?.data?.msg || "Failed to login");
        // alert(error.message);
        setLoading(false); // ✅ Also here
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-8 w-full max-w-md relative z-10 "
      >
        <h2 className="text-2xl font-bold text-center text-[#6a0dad] mb-6">
          <div className="text-4xl mb-2">Welcome Back</div>
          <div className="text-sm text-[#5b0d92]">
            Don't have an account ?{" "}
            <Link
              to="/auth/register"
              className="underline hover:text-[#6a0dad] font-medium"
            >
              Register
            </Link>
          </div>
        </h2>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#2b2b2b]">Email</label>
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

        <div className="mb-6">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#6a0dad] text-white rounded-lg font-semibold transition duration-300 disabled:opacity-60 cursor-pointer border-2 border-transparent hover:bg-[#fcfcfc] hover:text-[#6a0dad] hover:border-[#b27dd8]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
