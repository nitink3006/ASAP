import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./component/LandingPage/Home/Navbar";
import Home from "./component/LandingPage/Home";
import "./App.css";
import Login from "./component/LandingPage/Login";
import PreLoader from "./component/LandingPage/PreLoader";
import Signup from "./component/LandingPage/Signup";

function App() {
  const [loading, setLoading] = useState(true);

  return (
<>
{loading ? (
        <PreLoader onComplete={() => setLoading(false)} />
      ) : (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
        </Routes>
      </div>
    </Router>
      )}
    </>
  );
}

export default App;
