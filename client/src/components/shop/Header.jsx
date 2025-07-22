import {
  FaCartPlus,
  FaHome,
  FaProductHunt,
  FaList,
  FaInfoCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const ShopHeader = () => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { profilePicture } = user;

  const menuItems = [
    { to: "/shop", label: "Home", icon: <FaHome /> },
    { to: "/shop/products", label: "Products", icon: <FaProductHunt /> },
    { to: "/shop/sell", label: "Sell", icon: <FaCartPlus /> }, // Center
    { to: "/shop/listings", label: "Listings", icon: <FaList /> },
    { to: "/shop/about", label: "About", icon: <FaInfoCircle /> },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50
                  bg-violet-50/95
                  border-b border-violet-200
                  shadow-md backdrop-blur-md
                  h-16 flex items-center justify-between px-4 md:px-8"
    >
      {/* Left: Logo */}
      <div className="w-1/3">
      <Link to="/shop" className="flex items-center w-1/3">
        <span className="text-2xl font-extrabold tracking-wide text-violet-700">
          CampusCart
        </span>
      </Link>
      </div>

      {/* Center: Menu */}
      <div className="hidden md:flex justify-center items-center gap-8 w-1/3">
        {menuItems.map(({ to, label, icon }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-2 text-base font-medium transition-all duration-200 ${
                isActive
                  ? "text-violet-700 border-b-2 border-violet-600 pb-1"
                  : "text-violet-500 hover:text-violet-600 hover:pb-1"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right: Profile */}
      <div className="flex justify-end items-center w-1/3 ">
        <Link to="/user/userAccount" className="ml-auto">
          <img
            src={profilePicture || "/images/user-avatar.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-violet-200 hover:ring-2 hover:ring-violet-300 transition-all duration-200"
          />
        </Link>
      </div>
    </nav>
  );
};

export default ShopHeader;
