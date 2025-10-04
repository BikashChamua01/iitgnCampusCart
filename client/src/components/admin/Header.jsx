import { FaSearch, FaUserCircle, FaCartPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserAccount from "@/pages/user/UserAccount";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const { gender, profilePicture } = user;
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-2 shadow-md"
      style={{
        backgroundColor: "#6a0dad", // Deep purple background
        color: "#f4f4f4", // Light text
      }}
    >
      {/* Logo */}
      <div className="text-xl font-semibold tracking-wide">Admin Panel</div>

      {/* Right Section */}
      <div className="flex items-center gap-x-5">
        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <span
            className="absolute inset-y-0 left-0 flex items-center pl-3"
            style={{ color: "#6a0dad" }}
          >
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-1 rounded-md bg-white border shadow-sm outline-none text-[#2b2b2b] text-sm"
            style={{
              borderColor: "#d8cce4",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          />
        </div>

        {/* User acount */}
        <div className="flex justify-end items-center w-10 h-10 ">
          <Link to="/user/userAccount" className="ml-auto">
            <img
              src={profilePicture || "/images/user-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-violet-200 hover:ring-2 hover:ring-violet-300 transition-all duration-200"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;
