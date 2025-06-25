import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaProductHunt,
  FaList,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const ShopSidebar = () => {
  const { pathname } = useLocation();

  const menuItems = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/products", label: "Products", icon: <FaProductHunt /> },
    { to: "/listings", label: "Listings", icon: <FaList /> },
    { to: "/about", label: "About", icon: <FaInfoCircle /> },
  ];

  return (
    <aside
      className="w-20 bg-purple text-text-light hidden lg:flex flex-col justify-between items-center shadow-md fixed left-0 top-14"
      style={{ height: "calc(100vh - 3.5rem)" }} // full height minus header
    >
      {/* Top content */}
      <div className="flex flex-col items-center w-full mt-4">
        <div className="text-center text-xl font-bold tracking-tight mb-6"></div>

        <nav className="flex flex-col gap-6 items-center w-full">
          {menuItems.map(({ to, label, icon }) => {
            const isActive = pathname === to;
            return (
              <Link
                to={to}
                key={to}
                className={`flex flex-col items-center text-sm font-medium px-2 py-2 w-full text-center transition-all duration-200 ${
                  isActive
                    ? "bg-purple-hover text-white shadow"
                    : "hover:bg-purple-soft hover:text-white"
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
        <Link
          to="/logout"
          className="flex flex-col items-center text-sm text-text-light px-2 py-2 w-full text-center hover:bg-purple-soft hover:text-white transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="mt-1 text-xs">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default ShopSidebar;
