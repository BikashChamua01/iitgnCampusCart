import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaProductHunt,
  FaList,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const ShopSidebar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const menuItems = [
    { to: "/shop", label: "Home", icon: <FaHome /> },
    { to: "/shop/products", label: "Products", icon: <FaProductHunt /> },
    { to: "/shop/listings", label: "Listings", icon: <FaList /> },
    { to: "/about", label: "About", icon: <FaInfoCircle /> },
  ];

  return (
    <aside
      className="w-20 fixed left-0 top-12 hidden lg:flex flex-col justify-between items-center shadow-md"
      style={{
        backgroundColor: "#6a0dad", // Deep purple
        color: "#f4f4f4", // Light text
        height: "calc(100vh - 3rem)", // Adjust for header height
      }}
    >
      {/* Top content */}
      <div className="flex flex-col items-center w-full mt-4">
        <nav className="flex flex-col gap-6 items-center w-full">
          {menuItems.map(({ to, label, icon }) => {
            const isActive = pathname === to;
            return (
              <Link
                to={to}
                key={to}
                className={`flex flex-col items-center text-sm font-medium px-2 py-2 w-full text-center transition-all duration-200 ${
                  isActive
                    ? "bg-[#5a099a] text-white shadow" // darker purple on active
                    : "hover:bg-[#b491c8] hover:text-white" // soft purple on hover
                }`}
              >
                <div className="text-lg">{icon}</div>
                <span className="mt-1 text-xs">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button pinned to bottom */}
      <div className="mb-6 w-full">
        <div
          className="flex flex-col items-center text-sm px-2 py-2 w-full text-center transition-all duration-200 hover:bg-[#b491c8] hover:text-white"
          style={{ color: "#f4f4f4" }}
          onClick={() =>
            dispatch(logout()).then(() => toast.success("Logged-Out"))
          }
        >
          <FaSignOutAlt className="text-lg" />
          <span className="mt-1 text-xs">Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default ShopSidebar;
