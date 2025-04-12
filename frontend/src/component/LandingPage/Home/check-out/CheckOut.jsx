import React, { useEffect, useState } from "react";
import BookingDetails from "./BookingDetails";
import Navbar from "../Navbar";
import Config from "../../../../Config";

const CheckOut = () => {
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
                    setTotalPrice(total.toFixed(2));
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex justify-center mt-12 bg-gray-100 py-10">
                <div className="flex w-full max-w-6xl gap-6 px-6">
                    {/* Left Box */}
                    <BookingDetails totalAmount={totalPrice} selectedServices={cartItems} />

                    {/* Right Box */}
                    <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-xl font-semibold mb-4">Your Cart</h1>

                        {loading ? (
                            <p>Loading...</p>
                        ) : cartItems.length > 0 ? (
                            <div className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between border p-4 rounded"
                                    >
                                        <img
                                            src={
                                                item.service?.images
                                                    ? `${Config.MEDIA_URL}${item.service.images}`
                                                    : "https://via.placeholder.com/50"
                                            }
                                            alt={item.service?.name || "Service"}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div className="flex-1 ml-4">
                                            <h2 className="font-semibold">
                                                {item.service?.name || item.name}
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                {item.service?.description || item.description} ×{" "}
                                                {item.quantity}
                                            </p>
                                        </div>
                                        <div className="font-semibold text-right">
                                            ${item.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Your cart is empty.</p>
                        )}

                        {/* Summary Section */}
                        <div className="border-t mt-6 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Item Total</span>
                                <span>${totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>--</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                                <span>Total</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>

                        {/* Bottom Payment Display */}
                        <div className="flex justify-between items-center bg-gray-100 mt-6 p-4 rounded-lg shadow-inner">
                            <span className="text-base font-medium">Amount to Pay</span>
                            <span className="text-lg font-bold text-green-600">
                                ${totalPrice}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckOut;
