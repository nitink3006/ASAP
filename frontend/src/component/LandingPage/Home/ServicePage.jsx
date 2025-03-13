import React, { useState, useEffect } from "react";
import { FaStar, FaPlus, FaMinus } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const services = [
    {
        title: "Kitchen/Bathroom",
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504494228-eb2d1d.jpeg",
        options: [
            {
                name: "Pest control (includes utensil removal)",
                rating: 4.79,
                reviews: "98K",
                price: "Starts at $1,498",
                description: [
                    "Treatment will be completed in 2 visits with 2 weeks of gap",
                    "We'll remove utensils before the service begins",
                ],
                details: "6 options",
                image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504272013-0ef836.jpeg", // Replace with your image URL
            },
            {
                name: "Pest control (excludes utensil removal)",
                rating: 4.8,
                reviews: "63K",
                price: "Starts at $1,299",
                description: [
                    "Treatment will be completed in 2 visits with 2 weeks of gap",
                    "Excludes removal of utensils & objects before the service begins",
                ],
                details: "6 options",
                image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504274912-f9181e.jpeg", // Replace with your image URL
            },
        ],
    },
    {
        title: "Apartment/Bungalow",
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504496982-dc3ef5.jpeg",
        options: [
            {
                name: "Apartment pest control (includes utensil removal)",
                rating: 4.81,
                reviews: "25K",
                price: "Starts at $1,498",
                description: [
                    "Treatment will be completed in 2 visits with 2 weeks of gap",
                    "We'll remove utensils before the service begins",
                ],
                details: "5 options",
                image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1738258955021-96e8b0.jpeg", // Replace with your image URL
            },
            {
                name: "Apartment pest control (excludes utensil removal)",
                rating: 4.81,
                reviews: "132K",
                price: "Starts at $1,299",
                description: [
                    "Treatment will be completed in 2 visits with 2 weeks of gap",
                    "Excludes removal of utensils & objects before the service begins",
                ],
                details: "5 options",
                image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1738258958588-1d990f.jpeg", // Replace with your image URL
            },
        ],
    },
    {
        title: "Offices/Shops",
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_64,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504499889-e52c37.jpeg",
        options: [
            {
                name: "Office pest control",
                rating: 4.64,
                reviews: "4K",
                price: "Starts at $1,649",
                description: [
                    "Treatment will be completed in 2 visits with 2 weeks of gap",
                    "Excludes removal of utensils & objects before the service begins",
                ],
                details: "4 options",
                image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504277984-7347cb.jpeg", // Replace with your image URL
            },
            {
                name: "Retail shop pest control",
                rating: 4.63,
                reviews: "789",
                price: "Starts at $1,649",
                description: [
                    "Treatment will be completed in 2 visits with 2 weeks of gap",
                    "Excludes removal of utensils & objects before the service begins",
                ],
                details: "4 options",
                image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_128,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1731504268966-e3811e.jpeg", // Replace with your image URL
            },
        ],
    },
];

const ServicePage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart)); // Parse stored cart items
            } catch (error) {
                console.error("Error parsing cart data:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            // Only update localStorage if cartItems is not empty
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Handle category selection
    const handleCategorySelect = (index) => {
        setSelectedCategory(index);
    };

    // Filter services based on the selected category
    const filteredServices =
        selectedCategory !== null ? [services[selectedCategory]] : services;

    // Handle adding a service to the cart
    const handleAddToCart = (option) => {
        const existingItem = cartItems.find(
            (item) => item.name === option.name
        );
        if (existingItem) {
            handleIncreaseQuantity(cartItems.indexOf(existingItem));
        } else {
            setCartItems([...cartItems, { ...option, quantity: 1 }]);
        }
    };

    const handleIncreaseQuantity = (index) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity += 1;
        setCartItems(updatedCart);
    };

    const handleDecreaseQuantity = (index) => {
        const updatedCart = [...cartItems];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
        } else {
            updatedCart.splice(index, 1);
        }
        setCartItems(updatedCart);
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => {
        const price = parseInt(item.price.replace(/\D/g, ""), 10);
        return total + price * (item.quantity || 1);
    }, 0);

    return (
        <>
            <Navbar />
            <div className="flex p-10 mt-24 min-h-screen mx-auto">
                {/* Left Sidebar */}
                <div className="w-2/7 pr-4">
                    <h1 className="text-3xl font-bold">
                        Cockroach, Ant & General Pest Control
                    </h1>
                    <div className="flex items-center text-gray-600 mt-2">
                        <FaStar className="text-purple-600" />
                        <span className="ml-1">4.84 (1.0 M bookings)</span>
                    </div>

                    {/* Service Selection */}
                    <div className="mt-6 border p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">
                            Select a service
                        </h2>
                        <div className="flex justify-between mt-4">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="text-center cursor-pointer"
                                    onClick={() => handleCategorySelect(index)}
                                >
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-24 h-24 rounded-lg shadow"
                                    />
                                    <p className="mt-2 w-24 text-sm">
                                        {service.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-3/7 border-x border-t pt-6 px-6">
                    {filteredServices.map((service, index) => (
                        <div key={index} className="mb-8">
                            <h2 className="text-2xl  font-bold mb-4">
                                {service.title}
                            </h2>
                            {service.options.map((option, idx) => (
                                <div key={idx} className="p-4 border-b flex">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">
                                            {option.name}
                                        </h3>
                                        <div className="flex items-center mt-1">
                                            <FaStar className="text-purple-600 mr-1" />
                                            <span className="text-sm">
                                                {option.rating} (
                                                {option.reviews} reviews)
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-2">
                                            {option.price}
                                        </p>
                                        <ul className="list-disc list-inside mt-2">
                                            {option.description.map(
                                                (desc, i) => (
                                                    <li
                                                        key={i}
                                                        className="text-sm text-gray-600"
                                                    >
                                                        {desc}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                        <button className="text-purple-600 mt-2 text-sm cursor-pointer">
                                            View details
                                        </button>
                                    </div>
                                    <div className="w-40 ml-4">
                                        <img
                                            src={option.image}
                                            alt={option.name}
                                            className="rounded-lg"
                                        />
                                        <button
                                            className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg mt-2 text-sm block ml-auto"
                                            onClick={() =>
                                                handleAddToCart(option)
                                            }
                                        >
                                            Add
                                        </button>
                                        <span className="text-gray-600 text-sm block mt-1 ml-auto">
                                            {option.details}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Right Section (Cart) */}
                <div className="w-2/7 pl-4 border-t py-12">
                    <div className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Cart</h2>
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => {
                                const itemPrice =
                                    parseInt(
                                        item.price.replace(/\D/g, ""),
                                        10
                                    ) * (item.quantity || 1);
                                return (
                                    <div key={index} className="mb-4">
                                        <div className="grid grid-cols-2 items-center space-x-2 justify-between">
                                            <p className=" text-sm col-span-1">
                                                {item.name}
                                            </p>
                                            <div className="col-span-1 w-full flex justify-between">
                                                <div className="flex items-center border border-blue-400 rounded-lg w-fit bg-blue-100">
                                                    <button
                                                        className="text-blue-300 px-2 py-1 cursor-pointer"
                                                        onClick={() =>
                                                            handleDecreaseQuantity(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <FaMinus className="w-4 h-4" />
                                                    </button>
                                                    <span className="mx-2">
                                                        {item.quantity || 1}
                                                    </span>
                                                    <button
                                                        className="text-blue-300 px-2 py-1 cursor-pointer"
                                                        onClick={() =>
                                                            handleIncreaseQuantity(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <FaPlus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p>${itemPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="justify-center items-center flex">
                                <div className="text-purple-600 text-4xl">
                                    🛒
                                </div>
                                <p className="text-gray-600 ">
                                    No items in your cart
                                </p>
                            </div>
                        )}
                        {cartItems.length > 0 ? (
                            <Link to="/cart">
                                <button className="bg-purple-600 flex text-white px-4 py-2 rounded-lg mt-2 w-full hover:bg-purple-700 transition-all justify-between cursor-pointer">
                                    <p className="text-lg col-span-1">
                                        ${totalPrice}
                                    </p>
                                    View Cart
                                </button>
                            </Link>
                        ) : (
                            <p></p>
                        )}
                    </div>

                    <div className="mt-6 border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">ASAP Promise</h2>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <span className="text-green-600">✓</span>
                                <span className="ml-2">
                                    Verified Professionals
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-600">✓</span>
                                <span className="ml-2">
                                    Hassle Free Booking
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-600">✓</span>
                                <span className="ml-2">
                                    Transparent Pricing
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServicePage;
