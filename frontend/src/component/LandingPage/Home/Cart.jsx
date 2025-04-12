import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";
import Navbar from "./Navbar";
import Config from "../../../Config";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token || null;
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const res = await fetch(`${Config.API_URL}/orders/?type=cart`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch orders");

                const data = await res.json();

                if (data.status === "success") {
                    const unpaidOrders = data.orders.filter(
                        (order) => order.is_paid === false
                    );

                    const total = unpaidOrders.reduce(
                        (acc, item) => acc + parseFloat(item.amount),
                        0
                    );

                    setCartItems(unpaidOrders);
                    setTotalPrice(total);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const updateCartItem = async (orderId, newQuantity) => {
        try {
            // If quantity is 0 or less, remove the item
            if (newQuantity <= 0) {
                await removeItem(orderId);
                return;
            }

            const item = cartItems.find((item) => item.id === orderId);
            if (!item) return;

            const orderPayload = {
                services: [
                    {
                        service: item.service.id,
                        quantity: newQuantity,
                        optional_address: item.optional_address || "",
                        amount: parseFloat(item.service.price) * newQuantity,
                        is_paid: false,
                    },
                ],
            };

            const res = await fetch(`${Config.API_URL}/orders/?type=quantity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(orderPayload),
            });

            if (!res.ok) throw new Error("Failed to update item");

            // Update local state
            const updatedItems = cartItems.map((item) =>
                item.id === orderId
                    ? {
                          ...item,
                          quantity: newQuantity,
                          amount: (
                              parseFloat(item.service.price) * newQuantity
                          ).toFixed(2),
                      }
                    : item
            );

            setCartItems(updatedItems);

            const updatedTotal = updatedItems.reduce(
                (acc, item) => acc + parseFloat(item.amount),
                0
            );
            setTotalPrice(updatedTotal);
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    };

    const removeItem = async (orderId) => {
        try {
            const res = await fetch(
                `${Config.API_URL}/orders/detail/?product_id=${orderId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to delete item");

            // Remove the item with this order ID
            const updatedItems = cartItems.filter(
                (item) => item.id !== orderId
            );
            setCartItems(updatedItems);

            const updatedTotal = updatedItems.reduce(
                (acc, item) => acc + parseFloat(item.amount),
                0
            );
            setTotalPrice(updatedTotal);
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
    };

    const handleIncrease = (orderId) => {
        const item = cartItems.find((item) => item.id === orderId);
        const currentQuantity = item.quantity || 1;
        updateCartItem(orderId, currentQuantity + 1);
    };

    const handleDecrease = (orderId) => {
        const item = cartItems.find((item) => item.id === orderId);
        const currentQuantity = item.quantity || 1;
        updateCartItem(orderId, currentQuantity - 1);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen mt-20 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Loading your cart...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen mt-20 bg-gray-100 flex flex-col items-center p-6">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
                    <Link to="/">
                        <button className="flex items-center text-black mb-4 cursor-pointer">
                            <FaArrowLeft className="mr-2" /> Back to Home
                        </button>
                    </Link>

                    <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                        <span className="text-purple-600">🛒</span> Your Cart
                        {cartItems.length > 0 && (
                            <span className="text-sm font-normal text-gray-500">
                                ({cartItems.length}{" "}
                                {cartItems.length === 1 ? "item" : "items"})
                            </span>
                        )}
                    </h1>

                    {cartItems.length > 0 ? (
                        <>
                            {cartItems.map((item) => {
                                const itemPrice =
                                    parseFloat(item.service.price) *
                                    (item.quantity || 1);

                                return (
                                    <div
                                        key={item.id}
                                        className="mt-6 border-t pt-4 flex items-start gap-4"
                                    >
                                        <img
                                            src={
                                                item.service.images
                                                    ? `${Config.MEDIA_URL}${item.service.images}`
                                                    : "https://via.placeholder.com/150"
                                            }
                                            alt={item.service.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-700">
                                                        {item.service.name}
                                                    </h2>
                                                    <p className="text-sm text-gray-500">
                                                        $
                                                        {parseFloat(
                                                            item.service.price
                                                        ).toFixed(2)}{" "}
                                                        each
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    className="text-gray-400 hover:text-red-500 text-xl"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            {item.optional_address && (
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Address:{" "}
                                                    {item.optional_address}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-purple-400 rounded-lg w-fit bg-purple-50">
                                                    <button
                                                        className="text-purple-500 px-2 py-1 cursor-pointer hover:bg-purple-100"
                                                        onClick={() =>
                                                            handleDecrease(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <FaMinus className="w-3 h-3" />
                                                    </button>
                                                    <span className="mx-2">
                                                        {item.quantity || 1}
                                                    </span>
                                                    <button
                                                        className="text-purple-500 px-2 py-1 cursor-pointer hover:bg-purple-100"
                                                        onClick={() =>
                                                            handleIncrease(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <FaPlus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="text-lg font-bold text-gray-800">
                                                    ${itemPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                <h2 className="text-xl font-bold">Total:</h2>
                                <span className="text-xl font-bold text-purple-600">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="mt-8 text-center py-8">
                            <div className="text-5xl mb-4">🛒</div>
                            <p className="text-gray-500 text-lg">
                                Your cart is empty
                            </p>
                            <Link to="/service-page">
                                <button className="mt-4 cursor-pointer py-2 px-6 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                                    Browse Services
                                </button>
                            </Link>
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="mt-6 flex gap-4">
                            <Link to="/" className="flex-1">
                                <button className="w-full cursor-pointer py-3 px-4 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition">
                                    Add More Services
                                </button>
                            </Link>
                            <Link
                                to="/check-out"
                                state={{ cartItems, totalPrice }}
                                className="flex-1"
                            >
                                <button className="w-full cursor-pointer py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Cart;
