// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCog,
  FaProductHunt,
  FaList,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ sidebarToggle }) => {
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/products", label: "Products", icon: <FaProductHunt /> },
    { to: "/listings", label: "My Listing", icon: <FaList /> },
    { to: "/about", label: "About", icon: <FaInfoCircle /> },
  ];

  return (
    <div
      className={`${
        sidebarToggle ? "hidden" : "block"
      } w-64 bg-gray-800 fixed h-full px-4 py-2`}
    >
      <div className="my-2 mb-4">
        <h1 className="text-2xl text-white font-bold">Logo</h1>
      </div>
      <hr className="bg-amber-50 h-0.5" />
      <div className="flex flex-col justify-between h-full pb-20">
        <div>
          <ul className="mt-3 text-white font-bold">
            {links.map(({ to, label, icon }) => {
              const isActive = pathname === to;
              return (
                <li
                  key={to}
                  className={`mb-2 rounded py-2 px-3 hover:shadow hover:bg-blue-500 transition-colors ${
                    isActive ? "bg-blue-600" : ""
                  }`}
                >
                  <Link to={to} className="flex items-center">
                    {icon}
                    <span className="ml-2">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <ul className="mt-3 text-white font-bold">
            <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2 px-3">
              <Link to="/logout" className="flex items-center">
                <FaSignOutAlt className="w-6 h-6" />
                <span className="ml-2">Log Out</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
