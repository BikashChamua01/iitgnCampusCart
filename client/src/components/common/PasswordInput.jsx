// components/PasswordInput.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ label, name, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={name} className="block font-medium mb-1 text-[#2b2b2b]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad] pr-10"
          placeholder={`Enter your ${label?.toLowerCase() || "password"}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-[#6a0dad] focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
}
