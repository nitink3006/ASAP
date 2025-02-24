import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./component/LandingPage/Home/Navbar";
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

// Layout Components
const LayoutWithNavbar = ({ children }) => (
  <>
    <Navbar />
    <div className="content">{children}</div>
  </>
);

const LayoutWithoutNavbar = ({ children }) => (
  <div className="content">{children}</div>
);

function App() {
  const [loading, setLoading] = useState(true);

  return loading ? (
    <PreLoader onComplete={() => setLoading(false)} />
  ) : (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Routes with Navbar */}
          <Route
            path="/"
            element={
              <LayoutWithNavbar>
                <Home />
              </LayoutWithNavbar>
            }
          />
          <Route
            path="/signup"
            element={
              <LayoutWithNavbar>
                <Signup />
              </LayoutWithNavbar>
            }
          />
          <Route path="/contact" element={<Contact />} />

          {/* Routes without Navbar */}
          {["/login", "/order", "/add-category", "/add-service", "/remove-service"].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <LayoutWithoutNavbar>{getComponent(path)}</LayoutWithoutNavbar>
              }
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

// Helper function to return the correct component for each route
const getComponent = (path) => {
  const components = {
    "/login": <Login />,
    "/order": <Order />,
    "/add-category": <AddCategory />,
    "/add-service": <AddService />,
    "/remove-service": <RemoveService />,
  };
  return components[path] || <Home />;
};

export default App;
