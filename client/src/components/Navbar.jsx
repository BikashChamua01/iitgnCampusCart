import React from "react";
import { FaBars, FaSearch, FaBell, FaUserCircle,   FaSellsy, FaCartPlus } from "react-icons/fa";
import "../index.css";

const Navbar = ({sidebarToggle, setSidebarToggle}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 px-4 py-3 flex justify-between   ">
      <div className="flex items-center text-xl">
        <FaBars className="text-white me-4 cursor-pointer" onClick={()=>setSidebarToggle(!sidebarToggle)} />
        {/* <span className="text-white font-semibold">E-commerce</span> */}
      </div>
      <div className="flex items-center gap-x-5">
        <div className="relative md:w-65 rounded md:bg-amber-50 ">
          <span className="relative md:absolute inset-y-0 left-0  flex items-center pl-2">
            <button className=" p-1 focus:outline-none text-white md:text-black " >
            <FaSearch />
            </button>
          </span>
          <input
            type="text"
            className="w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block "
          />
        </div>
        <div className="text-white">
          {/* <FaBell  className="w-6 h-6"/> */}
          <FaCartPlus  className="w-4 h-4"/>
          Sell
          </div>
        <div className="relative" >
          <button className="text-white group">
            <FaUserCircle className="w-6 h-6 mt-1"/>
            <div className="z-10 hidden absolute rounded-lg shadow  w-40 h-fit group-focus:block top-full right-0 bg-white ">
              <ul className="py-4 text-sm text-gray-950 ">
                <li className="flex flex-col justify-between ">
                  <a className="py-2 mx-1 my-1 bg-gray-400 rounded-md" href="">Profile</a>
                  <a className="py-2 mx-1 my-1 bg-gray-400 rounded-md" href="">Setting</a>
                  <a className="py-2 mx-1 my-1 bg-gray-400 rounded-md" href="">Logout</a>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
