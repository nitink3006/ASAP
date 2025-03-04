import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const Cart = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                    <span className="text-purple-600">🛒</span> Your Cart
                </h1>
                <div className="mt-6 border-t pt-4">
                    <div className="flex items-center gap-4">
                        <img
                            src="https://via.placeholder.com/50"
                            alt="Pest Control"
                            className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-700">
                                Cockroach, Ant & General Pest Control
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Pest control (includes utensil removal) × 1
                            </p>
                        </div>
                        <span className="text-lg font-bold text-gray-800">
                            ₹1,098
                        </span>
                    </div>
                </div>
                <div className="mt-6 flex gap-4">
                    <button className="flex-1 py-2 px-4 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition">
                        Add Services
                    </button>
                    <button className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
