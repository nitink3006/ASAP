import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaCrosshairs } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const locationInputRef = useRef(null);
  const currentRoute = useLocation().pathname;
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  // Fetch location suggestions
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

  // Handle location selection
  const handleSelectLocation = (selectedLocation) => {
    setLocation(selectedLocation);
    localStorage.setItem("selectedLocation", selectedLocation);
    setLocationSuggestions([]);
  };

  // Fetch current location using Geolocation API
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        if (data.display_name) {
          handleSelectLocation(data.display_name);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target)
      ) {
        setLocationSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear everything from local storage
    setUser(null);
    navigate("/"); // Navigate to home after logout
  };

  return (
    <nav className="bg-white text-black shadow-md p-4 fixed top-0 w-full z-50 border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between md:px-0 lg:px-16">
        <Link to="/">
          <h1 className="text-2xl font-bold tracking-wide">ASAP</h1>
        </Link>

        <div className="hidden md:flex flex-wrap items-center space-x-6 w-fit md:max-w-96 lg:max-w-3xl">
          <div className="relative flex-1 min-w-[100px] max-w-[250px] sm:max-w-[180px] md:max-w-[250px]">
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md shadow-sm border border-gray-300">
              <MdLocationOn className="text-black mr-2 text-lg" />
              <input
                ref={locationInputRef}
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-500 placeholder-gray-500"
              />

            {/* Suggestions Dropdown */}
              <button onClick={fetchCurrentLocation} className="ml-2 text-gray-700">
                <FaCrosshairs className="text-lg hover:text-black transition duration-200 cursor-pointer" />
              </button>
            </div>
            {locationSuggestions.length > 0 && (
              <ul
                ref={dropdownRef}
                className="absolute left-0 mt-1 w-full bg-white border border-gray-300 shadow-md rounded-md max-h-48 overflow-y-auto z-10"
              >
                {locationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelectLocation(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex-1 min-w-[100px] max-w-[250px] sm:max-w-[180px] md:max-w-[250px]">
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md shadow-sm border border-gray-300">
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
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
          <Link
            to="/"
            className={`relative transition duration-300 ${currentRoute === "/"
              ? "text-black font-semibold border-b-2 border-black-600"
              : "text-gray-500 hover:text-black"
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

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative flex items-center cursor-pointer justify-center w-10 h-10 bg-gray-300 rounded-full text-lg font-semibold text-black"
              >
                {user?.user?.[0]?.name?.charAt(0)?.toUpperCase() || ""}             
                 </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg py-2 text-black">
                  <Link
                    to="/help-center"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Help Center
                  </Link>
                  <Link
                    to="/your-order"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Your Order
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`relative transition duration-300 ${currentRoute === "/login"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-500 hover:text-black"
                }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700 flex items-center"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <IoMdClose className="text-3xl text-black" />
          ) : (
            <IoMdMenu className="text-3xl text-black" />
          )}
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
          <Link
            to="/"
            className="text-lg text-gray-700 hover:text-blue-600 transition"
          >
            Home
          </Link>
          <Link to="/cart">
            <FaShoppingCart className="text-2xl cursor-pointer text-gray-700 hover:text-blue-600 transition" />
          </Link>
          {user ? (
            <>
              <Link
                to="/help-center"
                className="text-lg text-gray-700 hover:text-blue-600 transition"
              >
                Help Center
              </Link>
              <button
                onClick={handleLogout}
                className="text-lg text-gray-700 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-lg text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
