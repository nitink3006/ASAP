import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const locationInputRef = useRef(null);
  const currentRoute = useLocation().pathname;

  useEffect(() => {
    const fetchLocations = async (query) => {
      if (!query) return;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      setLocationSuggestions(data.map((item) => item.display_name));
    };

    if (location) {
      fetchLocations(location);
    } else {
      setLocationSuggestions([]);
    }
  }, [location]);

  return (
    <nav className="bg-white text-black shadow-md p-4 fixed top-0 w-full z-50 border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-25">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">
          UrbanClean
        </h1>

        {/* Search Bars */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Location Search */}
          <div className="relative">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md w-64 shadow-sm border border-gray-300">
              <MdLocationOn className="text-black mr-2 text-lg" />
              <input
                ref={locationInputRef}
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-500 placeholder-gray-500"
              />
            </div>
            {/* Location Suggestions Dropdown */}
            {locationSuggestions.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 shadow-lg rounded-md w-full mt-2 max-h-40 overflow-y-auto z-10 text-black">
                {locationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setLocation(suggestion);
                      setLocationSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Services Search */}
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md w-64 shadow-sm border border-gray-300">
            <FaSearch className="text-black mr-2 text-lg" />
            <input
              type="text"
              placeholder="Search services..."
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-500 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
          <Link
            to="/"
            className={`relative transition duration-300 ${
              currentRoute === "/" ? "text-black font-semibold border-b-2 border-black-600" : "text-gray-500 hover:text-black"
            }`}
          >
            Home
          </Link>
          <Link to="/cart">
            <FaShoppingCart
              className={`text-2xl cursor-pointer transition ${
                currentRoute === "/cart" ? "text-black" : "text-gray-500"
              }`}
            />
          </Link>
          <Link
            to="/login"
            className={`relative transition duration-300 ${
              currentRoute === "/login" ? "text-black font-semibold border-b-2 border-black" : "text-gray-500 hover:text-black"
            }`}
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-white border-t border-gray-200 p-4 shadow-md">
          <input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 w-64 rounded-md bg-gray-100 border border-gray-300 text-black placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Search services..."
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="px-4 py-2 w-64 rounded-md bg-gray-100 border border-gray-300 text-black placeholder-gray-500"
          />
          <Link to="/" className="text-lg text-gray-700 hover:text-blue-600 transition">Home</Link>
          <Link to="/cart">
            <FaShoppingCart className="text-2xl cursor-pointer text-gray-700 hover:text-blue-600 transition" />
          </Link>
          <Link to="/login" className="text-lg text-gray-700 hover:text-blue-600 transition">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
