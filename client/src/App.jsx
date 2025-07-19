// import the user shop pages
import ShopLayout from "./components/shop/layout";
import ShopHome from "./pages/shop/Home";
import ShopProducts from "./pages/shop/Products";
import ProductDetails from "./pages/shop/ProductDetails";
import ShopListing from "./pages/shop/Listing";
// import user pages
import UserAccount from "./pages/user/UserAccount";

// import the admin pages
import AdminLayout from "./components/admin/Layout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/Users";

// Import the common pages
import About from "./pages/common/About";
import Sell from "./pages/common/Sell";
import UnauthPage from "./pages/common/Unauth-page";
import Loader from "./components/common/Loader";

// Import the auth pages and layout
import AuthLayout from "./components/auth/Layout";
import RegistrationForm from "./pages/auth/RegistrationForm";
import LoginForm from "./pages/auth/LoginForm";
import { Toaster } from "sonner";

// import checkauth
import CheckAuth from "./components/common/CheckAuth";
import { checkAuth } from "./store/auth-slice";

// import the extra things
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Define default path */}
          <Route
            path="/"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user} />
            }
          />

          {/* User shop pages */}
          <Route
            path="/shop"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShopLayout />
              </CheckAuth>
            }
          >
            <Route path="" element={<ShopHome />} />
            <Route path="products" element={<ShopProducts />} />
            <Route path="about" element={<About />} />
            <Route path="listings" element={<ShopListing />} />
            <Route path="sell" element={<Sell />} />
            <Route path="products/:id" element={<ProductDetails />} />
          </Route>
          {/* User pages */}
          <Route
          path="/user"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShopLayout />
              </CheckAuth>
            }>
            <Route path="userAccount" element={<UserAccount/>}/>

          </Route>

          {/* Admin pages */}
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Auth Pages */}
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="register" element={<RegistrationForm />} />
            <Route path="login" element={<LoginForm />} />
          </Route>

          {/* Extra pages */}
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
