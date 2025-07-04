import React from "react";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  console.log(`Auth : ${isAuthenticated} , user: ${user}, children: ${children} `)
  const location = useLocation();

  // Related to authentication
  if (!isAuthenticated && location.pathname === "/") {
    console.log("!auth + /");
    return <Navigate to="/auth/login" />;
  }

  if (!isAuthenticated && !location.pathname.includes("/auth")) {
    console.log("!auth + /auth");
    return <Navigate to="/auth/login" />;
  }

  if (location.pathname === "/") {
    if (user?.isAdmin) <Navigate to="/admin/dashboard" />;
    else <Navigate to="/shop" />;
  }

  //   if authenticated and try to login or register again
  if (isAuthenticated && location.pathname.includes("/auth")) {
    console.log("isauth + /auth");
    if (user?.isAdmin) return <Navigate to="/admin/dashboard" />;
    else return <Navigate to="/shop" />;
  }

  //   if normal user try to accces admin pages
  if (location.pathname.includes("/admin") && !user?.isAdmin)
    return <Navigate to="/unauth-page" />;

  //   if admin tries to access the normal user pages
  if (location.pathname.includes("/shop") && user?.isAdmin)
    return <Navigate to="/admin/dashboard" />;

  return <>{children}</>;
};

export default CheckAuth;
