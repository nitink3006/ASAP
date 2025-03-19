import { useState } from "react";
import { MapPin, Clock, CreditCard, X } from "lucide-react";

const BookingDetails = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [addressSelected, setAddressSelected] = useState(false);
    const [slotSelected, setSlotSelected] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showSlotModal, setShowSlotModal] = useState(false);

    return (
        <div className="w-full mx-auto bg-white shadow-md rounded-lg p-4">
            {isLoggedIn ? (
                <>
                    {/* Send Booking Details */}
                    <div className="flex items-center gap-3 pb-4 border-b">
                        <MapPin className="text-gray-500" />
                        <div>
                            <p className="font-semibold">
                                Send booking details to
                            </p>
                            <p className="text-gray-600">+91 7667301112</p>
                        </div>
                    </div>

                    {/* Address Selection */}
                    <div className="flex flex-col gap-3 py-4 border-b">
                        <div className="flex items-center gap-3">
                            <MapPin className="text-gray-500" />
                            <p className="font-semibold">Address</p>
                        </div>
                        <button
                            onClick={() => setShowAddressModal(true)}
                            className="bg-[#7B41E6] text-white font-semibold py-2 px-4 rounded-lg w-full"
                        >
                            Select an address
                        </button>
                    </div>

                    {/* Slot Selection */}
                    <div
                        className={`flex flex-col gap-3 py-4 border-b ${
                            addressSelected
                                ? "opacity-100"
                                : "opacity-50 pointer-events-none"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Clock
                                className={`${
                                    addressSelected
                                        ? "text-gray-600"
                                        : "text-gray-400"
                                }`}
                            />
                            <p
                                className={`${
                                    addressSelected
                                        ? "text-black"
                                        : "text-gray-400"
                                }`}
                            >
                                Slot
                            </p>
                        </div>
                        {addressSelected && (
                            <button
                                onClick={() => setShowSlotModal(true)}
                                className="bg-[#7B41E6] text-white font-semibold py-2 px-4 rounded-lg w-full"
                            >
                                Select a slot
                            </button>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div
                        className={`flex flex-col gap-3 py-4 border-b ${
                            slotSelected
                                ? "opacity-100"
                                : "opacity-50 pointer-events-none"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <CreditCard
                                className={`${
                                    slotSelected
                                        ? "text-gray-600"
                                        : "text-gray-400"
                                }`}
                            />
                            <p
                                className={`${
                                    slotSelected
                                        ? "text-black"
                                        : "text-gray-400"
                                }`}
                            >
                                Payment Method
                            </p>
                        </div>
                        {slotSelected && (
                            <button className="bg-[#7B41E6] text-white font-semibold py-2 px-4 rounded-lg w-full">
                                Select payment method
                            </button>
                        )}
                    </div>

                    {/* Cancellation Policy */}
                    <div className="py-4">
                        <p className="font-semibold text-lg">
                            Cancellation policy
                        </p>
                        <p className="text-gray-600 text-sm">
                            Free cancellations if done more than 3 hrs before
                            the service or if a professional isn’t assigned. A
                            fee will be charged otherwise.
                        </p>
                        <a
                            href="#"
                            className="text-[#7B41E6] font-semibold underline"
                        >
                            Read full policy
                        </a>
                    </div>
                </>
            ) : (
                // BEFORE LOGIN VIEW
                <div className="text-center">
                    <p className="font-semibold text-lg">Account</p>
                    <p className="text-gray-600 text-sm mb-4">
                        To book the service, please login or sign up
                    </p>
                    <button
                        onClick={() => setIsLoggedIn(true)}
                        className="w-full bg-[#7B41E6] text-white font-semibold py-2 rounded-lg hover:bg-[#6a34c7] transition"
                    >
                        Login
                    </button>
                </div>
            )}

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-lg font-semibold">
                                Select an Address
                            </h2>
                            <X
                                className="cursor-pointer"
                                onClick={() => setShowAddressModal(false)}
                            />
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    setAddressSelected(true);
                                    setShowAddressModal(false);
                                }}
                                className="w-full bg-[#7B41E6] text-white font-semibold py-2 rounded-lg"
                            >
                                Use Current Address
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Slot Modal */}
            {showSlotModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-lg font-semibold">
                                Select a Slot
                            </h2>
                            <X
                                className="cursor-pointer"
                                onClick={() => setShowSlotModal(false)}
                            />
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    setSlotSelected(true);
                                    setShowSlotModal(false);
                                }}
                                className="w-full bg-[#7B41E6] text-white font-semibold py-2 rounded-lg"
                            >
                                Choose Slot
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetails;
