import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
