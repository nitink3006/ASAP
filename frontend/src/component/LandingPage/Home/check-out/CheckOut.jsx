import React, { useEffect, useState } from "react";
import NavbarCheckout from "./Navbar-checkout";
import BookingDetails from "./BookingDetails";

const CheckOut = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
        // Simulate login check (Replace with actual auth logic)
        const userLoggedIn = localStorage.getItem("userLoggedIn");
        setIsLoggedIn(userLoggedIn === "true");
    }, []);

    const totalPrice = cartItems.reduce((total, item) => {
        const price = parseInt(item.price.replace(/\D/g, ""), 10);
        return total + price * (item.quantity || 1);
    }, 0);

    return (
        <>
            <NavbarCheckout />

            <div className="flex justify-center items-center mt-12  bg-gray-100">
                <div className="w-full min-h-screen bg-white p-6 rounded-lg flex gap-6">
                    {/* Left Section */}
                    <div className="w-1/2  rounded-lg p-4 ">
                        <h1 className="text-2xl font-semibold mb-4">
                            Checkout
                        </h1>
                        <BookingDetails />
                    </div>

                    {/* Right Section */}
                    <div className="w-1/2 max-w-2xl p-10  bg-white  rounded-lg">
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="border mb-4 bg-white p-6 rounded-lg shadow-lg"
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
                                        <h2 className="text-lg font-semibold">
                                            {item.name}
                                        </h2>
                                        <div className="flex justify-between items-center mt-2">
                                            <span>
                                                {item.description} ×{" "}
                                                {item.quantity}
                                            </span>
                                            <span className="font-semibold">
                                                $
                                                {parseInt(
                                                    item.price.replace(
                                                        /\D/g,
                                                        ""
                                                    ),
                                                    10
                                                ) * item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Your cart is empty.</p>
                        )}

                        <div className="border rounded-lg p-4 mb-4">
                            <h2 className="text-lg font-semibold mb-2">
                                Payment Summary
                            </h2>
                            <div className="flex justify-between">
                                <span>Item Total</span>
                                <span>${totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>--</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>
                        <div className="flex justify-between  bg-white p-6 rounded-lg shadow-md sticky botoom-0">
                            <span className="text-lg font-semibold">
                                Amount to Pay
                            </span>
                            <p className="text-xl font-bold ">${totalPrice}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckOut;
