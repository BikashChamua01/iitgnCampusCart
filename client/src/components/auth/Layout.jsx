import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row ">
      {/* Left side - Welcome Section */}
      <div className="md:w-1/2 w-full md:flex items-center justify-center bg-[#f8f1ff] p-10 relative overflow-hidden hidden">
        {/* Background Glow Left */}
        <div className="absolute w-72 h-72 bg-purple-400 opacity-40 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-60 h-60 bg-pink-200 opacity-30 rounded-full blur-2xl bottom-10 right-10 animate-ping"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-[#5b0d92] mb-4">
            Welcome to CampusCart
          </h1>
          <p className="text-[#6a0dad] text-lg max-w-xs mx-auto">
            Buy and Sell with ease. Join the IITGN student marketplace!
          </p>
        </div>
      </div>

      {/* Right side - Form Section with vertical glow behind Outlet */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-0 md:p-8 relative overflow-hidden bg-white">
        {/* Vertical Glowing Ellipse Behind Form */}
        <div className="absolute h-[90%] w-[80%] bg-[#d6cae1] blur-3xl opacity-70 rounded-full animate-pulse ease-in-out" />

        {/* Outlet Form Goes Here */}
        <div className="w-full relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
