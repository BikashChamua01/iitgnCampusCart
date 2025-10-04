import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaProductHunt,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";

const menuItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/admin/products", label: "Products", icon: <FaProductHunt /> },
  { to: "/admin/users", label: "Users", icon: <FaUsers /> },
  { to: "/admin/about", label: "About", icon: <FaInfoCircle /> },
];

export default function AdminFooter() {
  const location = useLocation();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-purple-800 text-white py-3 flex justify-around border-t border-purple-700 md:hidden z-50">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center transition-colors ${
              isActive
                ? "text-white scale-105 transition-all ease-in-out"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <div className="text-lg">{item.icon}</div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </footer>
  );
}
