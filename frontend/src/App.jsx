import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Home from "./component/LandingPage/Home";
import "./App.css";
import Login from "./component/LandingPage/Login";
import PreLoader from "./component/LandingPage/PreLoader";
import Signup from "./component/LandingPage/Signup";
import Order from "./component/AdminDashboard/Order";
import AddCategory from "./component/AdminDashboard/AddCategory";
import AddService from "./component/AdminDashboard/AddService";
import RemoveService from "./component/AdminDashboard/RemoveService";
import Contact from "./component/Contact";
import HelpCenter from "./component/LandingPage/Home/HelpCenter";
import ServicePage from "./component/LandingPage/Home/ServicePage";

function App() {
  const [loading, setLoading] = useState(true);

  return loading ? (
    <PreLoader onComplete={() => setLoading(false)} />
  ) : (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Routes with Navbar */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/service-page" element={<ServicePage />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order" element={<Order />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/remove-service" element={<RemoveService />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
