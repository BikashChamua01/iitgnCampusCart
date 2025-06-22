
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar";
import "./App.css";
import { useState } from "react";
import RegistrationForm from "./pages/RegistrationForm.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import LoginForm from "./pages/LoginForm.jsx";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Products from "./pages/Products.jsx";

const App = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  return (
    // <div className="flex" >
    //   <Sidebar sidebarToggle={sidebarToggle} />
    //   <Dashboard  sidebarToggle={sidebarToggle}
    //   setSidebarToggle={setSidebarToggle}/>
    // </div>
    <BrowserRouter>
      <div className="flex">
        <Sidebar sidebarToggle={sidebarToggle} />
        <div className="w-full">
          <div className={`${sidebarToggle ? "" : "ml-64 "} `}>
            <Navbar
              sidebarToggle={sidebarToggle}
              setSidebarToggle={setSidebarToggle}
            />
          </div>

          <main className="flex-1 p-4 ml-64 ">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/login" element={<LoginForm />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

// import React from "react";
// import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
// import RegistrationForm from "./components/RegistrationForm";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import About from "./pages/About";

// const App = () => {
//   return (
//     <div>
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/register" element={<RegistrationForm />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// };

export default App;
