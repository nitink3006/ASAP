import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { useLocation, Link, useNavigate } from "react-router-dom";

const NavbarCheckout = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [location, setLocation] = useState("");
    const [service, setService] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const locationInputRef = useRef(null);
    const currentRoute = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user details from local storage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

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

    const handleLogout = () => {
        localStorage.clear(); // Clear everything from local storage
        setUser(null);
        navigate("/"); // Navigate to home after logout
    };

    return (
        <nav className="bg-white text-black shadow-md p-4 fixed top-0 w-full z-50 border-b border-gray-200">
            <div className="container mx-auto flex items-center justify-between md:px-0 lg:px-16">
                {/* Logo */}
                <Link to="/">
                    <h1 className="text-2xl font-bold tracking-wide">ASAP</h1>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
                    <Link to="/cart">
                        <FaShoppingCart
                            className={`text-2xl cursor-pointer transition ${
                                currentRoute === "/cart"
                                    ? "text-black"
                                    : "text-gray-500"
                            }`}
                        />
                    </Link>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="relative flex items-center cursor-pointer justify-center w-10 h-10 bg-gray-300 rounded-full text-lg font-semibold text-black"
                            >
                                {user.customer.name.charAt(0).toUpperCase()}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg py-2 text-black">
                                    <Link
                                        to="/help-center"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Help Center
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
                            className={`relative transition duration-300 ${
                                currentRoute === "/login"
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

export default NavbarCheckout;
