import { FaSearch, FaUserCircle, FaCartPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ShopHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const { gender, profilePicture } = user;
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0  bg-sky-900 left-0 right-0 z-50 flex justify-between items-center px-4 py-2 shadow-md"
      style={{
        // backgroundColor: "#6a0dad", // Deep purple background
        //  backgroundColor:"antiquewhite",
        color: "#f4f4f4", // Light text
      }}
    >
      {/* Logo */}
      <div className="text-xl font-semibold tracking-wide">CampusCart</div>

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

        {/* Sell Button */}
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-white"
          style={{ color: "#f4f4f4" }}
          onClick={() => navigate("/shop/sell")}
        >
          <FaCartPlus className="w-4 h-4" />
          <span
            className="text-sm font-medium"
            // onClick={() => navigate("/shop/sell")}
          >
            Sell
          </span>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button className="group focus:outline-none">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer"
              />
            ) : gender === "male" ? (
              <img
                src="/images/male_avatar.jpeg"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer"
              />
            ) : (
              <img
                src="/images/female_avatar.jpeg"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer"
              />
            )}
            <div className="z-10 hidden group-hover:block absolute right-0 mt-0 w-36 bg-white text-[#2b2b2b] rounded-lg shadow-md">
              <ul className="py-2 text-sm">
                <li className="hover:bg-[#ede4f7] px-4 py-2 rounded">
                  <a href="#">Profile</a>
                </li>
                <li className="hover:bg-[#ede4f7] px-4 py-2 rounded">
                  <a href="#">Setting</a>
                </li>
                <li className="hover:bg-[#ede4f7] px-4 py-2 rounded">
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ShopHeader;
