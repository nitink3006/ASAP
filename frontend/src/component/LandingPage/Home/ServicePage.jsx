import React, { useState, useEffect } from "react";
import { FaStar, FaPlus, FaMinus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Config from "../../../Config";

const ServicePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { serviceId, serviceName, subCategoryId, subCategoryName } =
        location.state || {};

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState({});
    const [services, setServices] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token || null;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(
                    `${Config.API_URL}/services/retrieve-by-id/?service_id=${subCategoryId}`
                );
                if (!response.ok) throw new Error("Failed to fetch services");
                const data = await response.json();

                if (!data?.data || typeof data.data !== "object") {
                    throw new Error("Unexpected API response structure");
                }

                const categoriesData = Object.keys(data.data).reduce(
                    (acc, categoryName) => {
                        const subCategoryData = data.data[categoryName];
                        acc[categoryName] = {
                            categoryImage: subCategoryData.category_image,
                            services: subCategoryData.services,
                        };
                        return acc;
                    },
                    {}
                );

                setCategories(categoriesData);
                const allServicesArray = Object.values(categoriesData).flatMap(
                    (category) => category.services
                );
                setAllServices(allServicesArray);
                setServices(allServicesArray);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching services:", err.message);
                setError(err.message);
                setLoading(false);
            }
        };

        if (subCategoryId) fetchServices();
    }, [subCategoryId]);

    // Add this useEffect to handle category filtering
    useEffect(() => {
        if (selectedCategory && categories[selectedCategory]) {
            setServices(categories[selectedCategory].services);
        } else {
            setServices(allServices);
        }
    }, [selectedCategory, categories, allServices]);

    const notifySuccess = (msg) => {
        if (!toast.isActive(msg)) {
            toast.success(msg, { toastId: msg });
        }
    };
    const notifyError = (msg) => {
        if (!toast.isActive(msg)) {
            toast.error(msg, { toastId: msg });
        }
    };

    const handleAddToCart = (service) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.service_id === service.service_id
            );
            if (existingItem) {
                notifySuccess("Increased quantity in cart");
                return prevItems.map((item) =>
                    item.service_id === service.service_id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }
            notifySuccess("Added to cart");
            return [
                ...prevItems,
                {
                    ...service,
                    quantity: 1,
                    category: serviceName,
                    subCategory: subCategoryName,
                    serviceCategory: selectedCategory || service.category,
                },
            ];
        });
    };

    const handleIncreaseQuantity = (serviceId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.service_id === serviceId
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            )
        );
        toast.success("Increased quantity in cart");
    };

    const handleDecreaseQuantity = (serviceId) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map((item) => {
                if (item.service_id === serviceId) {
                    const newQuantity = item.quantity - 1;
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });

            const filteredItems = updatedItems.filter(
                (item) => item.quantity > 0
            );

            const wasRemoved = updatedItems.some(
                (item) => item.service_id === serviceId && item.quantity === 0
            );

            if (wasRemoved) {
                toast.info("Item removed from cart");
            } else {
                toast.success("Decreased quantity in cart");
            }

            return filteredItems;
        });
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
    );

    const handleViewCart = async () => {
        try {
            const orderPayload = {
                services: cartItems.map((item) => ({
                    service: item.service_id,
                    quantity: item.quantity,
                    optional_address: "",
                    amount: item.price * item.quantity,
                    is_paid: false,
                })),
            };

            const response = await fetch(
                `${Config.API_URL}/orders/?type=cart-quantity`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                    body: JSON.stringify(orderPayload),
                }
            );

            if (!response.ok) throw new Error("Order submission failed");

            notifySuccess("Cart submitted successfully");
            navigate("/cart", {
                state: {
                    cartItems,
                    totalPrice,
                    serviceName,
                    subCategoryName,
                    orderStatus: "success",
                },
            });
        } catch (error) {
            notifyError("Something went wrong submitting your cart");
            console.error("Order submission error:", error);
            navigate("/cart", {
                state: {
                    cartItems,
                    totalPrice,
                    serviceName,
                    subCategoryName,
                    orderStatus: "failed",
                },
            });
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );

    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex flex-col lg:flex-row p-4 md:p-6 lg:p-10 mt-24 min-h-screen mx-auto">
                {/* Left Sidebar */}
                <div className="w-full lg:w-2/7 lg:pr-4 lg:sticky lg:self-start lg:top-24 mb-6 lg:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {subCategoryName}
                    </h1>
                    <div className="flex items-center text-gray-600 mt-2">
                        <FaStar className="text-purple-600" />
                        <span className="ml-1">4.84 (1.0 M bookings)</span>
                    </div>

                    <div className="mt-6 border p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">
                            Select a service
                        </h2>
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                            {Object.keys(categories).map(
                                (categoryName, index) => {
                                    const category = categories[categoryName];
                                    return (
                                        <div
                                            key={index}
                                            className="text-center cursor-pointer flex-shrink-0"
                                            onClick={() =>
                                                setSelectedCategory(
                                                    categoryName
                                                )
                                            }
                                        >
                                            <img
                                                src={`${Config.MEDIA_URL}${category.categoryImage}`}
                                                alt={categoryName}
                                                className="w-20 h-20 md:w-24 md:h-24 rounded-lg shadow"
                                            />
                                            <p className="mt-2 w-20 md:w-24 text-xs md:text-sm">
                                                {categoryName}
                                            </p>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full lg:w-3/7 lg:border-x lg:border-t lg:pt-6 px-0 lg:px-6 relative">
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl md:text-2xl font-bold">
                                {selectedCategory || subCategoryName}
                            </h2>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="text-purple-600 text-sm cursor-pointer underline"
                                >
                                    Show all services
                                </button>
                            )}
                        </div>

                        {!selectedCategory ? (
                            Object.keys(categories).map((categoryName) => (
                                <div key={categoryName}>
                                    <h3 className="text-lg font-semibold mt-6 mb-4 border-b pb-2">
                                        {categoryName}
                                    </h3>
                                    {categories[categoryName].services.map(
                                        (service, idx) => (
                                            <ServiceCard
                                                key={idx}
                                                service={service}
                                                onAddToCart={handleAddToCart}
                                            />
                                        )
                                    )}
                                </div>
                            ))
                        ) : services.length > 0 ? (
                            services.map((service, idx) => (
                                <ServiceCard
                                    key={idx}
                                    service={service}
                                    onAddToCart={handleAddToCart}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    No services found
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart Section */}
                <div className="w-full lg:w-2/7 lg:pl-4 lg:border-t lg:py-12 lg:sticky lg:self-start lg:top-24 mt-6 lg:mt-0">
                    <div className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Cart</h2>
                        {cartItems.length > 0 ? (
                            <>
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.service_id}
                                        item={item}
                                        onIncrease={handleIncreaseQuantity}
                                        onDecrease={handleDecreaseQuantity}
                                    />
                                ))}
                                <div className="mt-4 border-t pt-4">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total:</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={handleViewCart}
                                        className="bg-purple-600 text-white px-4 py-2 cursor-pointer rounded-lg mt-4 w-full hover:bg-purple-700 transition-all"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center py-4">
                                <div className="text-purple-600 text-4xl">
                                    🛒
                                </div>
                                <p className="text-gray-600 mt-2">
                                    No items in your cart
                                </p>
                            </div>
                        )}
                    </div>
                    <ASAPPromise />
                </div>
            </div>
            <Footer />
        </>
    );
};

const ServiceCard = ({ service, onAddToCart }) => (
    <div className="p-4 border-b flex flex-col sm:flex-row">
        <div className="flex-1">
            <h3 className="text-lg md:text-xl font-semibold">
                {service.service_name}
            </h3>
            <div className="flex items-center mt-1">
                <FaStar className="text-purple-600 mr-1" />
                <span className="text-sm">4.8 (10K reviews)</span>
            </div>
            <p className="text-gray-600 mt-2">${service.price.toFixed(2)}</p>
            <ul className="list-disc list-inside mt-2">
                <li className="text-sm text-gray-600">
                    {service.duration} minutes
                </li>
                <li className="text-sm text-gray-600">{service.description}</li>
            </ul>
            <button className="text-purple-600 mt-2 text-sm cursor-pointer">
                View details
            </button>
        </div>
        <div className="w-full sm:w-40 mt-4 sm:mt-0 sm:ml-4">
            <img
                src={
                    service.image_url
                        ? `${Config.MEDIA_URL}${service.image_url}`
                        : "https://via.placeholder.com/150"
                }
                alt={service.service_name}
                className="rounded-lg w-full h-24 object-cover"
            />
            <button
                className="bg-purple-600 text-white px-4 cursor-pointer py-2 rounded-lg mt-2 text-sm block ml-auto"
                onClick={() => onAddToCart(service)}
            >
                Add
            </button>
        </div>
    </div>
);

const CartItem = ({ item, onIncrease, onDecrease }) => {
    const itemPrice = item.price * (item.quantity || 1);
    return (
        <div className="mb-4">
            <div className="grid grid-cols-2 items-center space-x-2 justify-between">
                <p className="text-sm col-span-1 truncate">
                    {item.service_name}
                </p>
                <div className="col-span-1 w-full flex justify-between">
                    <div className="flex items-center border border-blue-400 rounded-lg w-fit bg-blue-100">
                        <button
                            className="text-blue-300 px-2 py-1 cursor-pointer"
                            onClick={() => onDecrease(item.service_id)}
                        >
                            <FaMinus className="w-4 h-4" />
                        </button>
                        <span className="mx-2">{item.quantity || 1}</span>
                        <button
                            className="text-blue-300 px-2 py-1 cursor-pointer"
                            onClick={() => onIncrease(item.service_id)}
                        >
                            <FaPlus className="w-4 h-4" />
                        </button>
                    </div>
                    <p>${itemPrice.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

const ASAPPromise = () => (
    <div className="mt-6 border p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">ASAP Promise</h2>
        <div className="space-y-2">
            {[
                "Verified Professionals",
                "Hassle Free Booking",
                "Transparent Pricing",
            ].map((item) => (
                <div key={item} className="flex items-center">
                    <span className="text-green-600">✓</span>
                    <span className="ml-2">{item}</span>
                </div>
            ))}
        </div>
    </div>
);

export default ServicePage;
