import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/LandingPage/Home/Navbar";
import Home from "./component/LandingPage/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
