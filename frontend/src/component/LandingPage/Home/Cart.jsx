import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "./Navbar";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const totalPrice = cartItems.reduce((total, item) => {
        const price = parseInt(item.price.replace(/\D/g, ""), 10);
        return total + price * (item.quantity || 1);
    }, 0);

    return (
        <>
            {" "}
            <Navbar />
            <div className="min-h-screen mt-14 bg-gray-100 flex flex-col items-center p-6">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
                    <Link to="/service-page">
                        <button className="flex items-center text-black mb-4">
                            <FaArrowLeft className="mr-2" /> Back
                        </button>
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                        <span className="text-purple-600">🛒</span> Your Cart
                    </h1>

                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <div
                                key={index}
                                className="mt-6 border-t pt-4 flex items-center gap-4"
                            >
                                <img
                                    src={
                                        item.image ||
                                        "https://via.placeholder.com/50"
                                    }
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        {item.name}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {item.description} × {item.quantity}
                                    </p>
                                </div>
                                <span className="text-lg font-bold text-gray-800">
                                    ₹
                                    {parseInt(
                                        item.price.replace(/\D/g, ""),
                                        10
                                    ) * item.quantity}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 mt-4">
                            Your cart is empty.
                        </p>
                    )}

                    <div className="mt-6 flex justify-between items-center border-t pt-4">
                        <h2 className="text-xl font-bold">
                            Total: ₹{totalPrice}
                        </h2>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <Link to="/service-page" className="flex-1">
                            <button className="w-full py-2 px-4 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition">
                                Add Services
                            </button>
                        </Link>
                        <button className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
