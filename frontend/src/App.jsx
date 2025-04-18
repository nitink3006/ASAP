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
import SubCategory from "./component/AdminDashboard/SubCategory";
import Cart from "./component/LandingPage/Home/Cart";
import Service from "./component/AdminDashboard/Service";
import OrderPage from "./component/LandingPage/Home/OrderPage";
import CheckOut from "./component/LandingPage/Home/check-out/CheckOut";
import ScrollToTop from "./component/LandingPage/ScrollToTop";

function App() {
    const [loading, setLoading] = useState(true);

    return loading ? (
        <PreLoader onComplete={() => setLoading(false)} />
    ) : (
        <Router>
            <ScrollToTop />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/service-page" element={<ServicePage />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/order" element={<Order />} />
                <Route path="/add-category" element={<AddCategory />} />
                <Route path="/add-service" element={<AddService />} />
                <Route path="/service" element={<Service />} />
                <Route path="/remove-service" element={<RemoveService />} />
                <Route path="/sub-category" element={<SubCategory />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/your-order" element={<OrderPage />} />
                <Route path="/check-out" element={<CheckOut />} />
            </Routes>
        </Router>
    );
}

export default App;
