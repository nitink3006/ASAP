import React, { useState, useEffect } from "react";
import { XCircle, CheckCircle, Truck } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Order = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 1,
      serviceName: "Home Cleaning",
      provider: "UrbanClap Cleaning Experts",
      dateTime: "Feb 15, 2025 | 10:00 AM",
      location: "123, Main Street, City",
      details: "Includes deep cleaning of kitchen and bathrooms.",
      price: "50",
      status: "Pending",
      bookedBy: "John Doe",
      plan: "Premium Package",
      additionalNotes: "Focus on windows and carpet cleaning.",
    },
    {
      id: 2,
      serviceName: "AC Repair",
      provider: "UrbanClap AC Services",
      dateTime: "Feb 16, 2025 | 2:00 PM",
      location: "456, Park Avenue, City",
      details: "Gas refilling and general servicing.",
      price: "70",
      status: "On the way",
      bookedBy: "Jane Smith",
      plan: "Standard Repair",
      additionalNotes: "Check cooling efficiency.",
    },
    {
      id: 3,
      serviceName: "Plumbing Service",
      provider: "UrbanClap Plumbing Experts",
      dateTime: "Feb 17, 2025 | 11:00 AM",
      location: "789, Lake Road, City",
      details: "Leakage fixing and pipe replacement.",
      price: "40",
      status: "Completed",
      bookedBy: "Alice Johnson",
      plan: "Basic Repair",
      additionalNotes: "Ensure all leaks are properly sealed.",
    },
  ]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateStatus = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-grow transition-all ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <Header toggleSidebar={toggleSidebar} />
          <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
              Order Details
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
                <thead>
                  <tr className="bg-gray-300 text-gray-700 text-left">
                    <th className="p-4 rounded-tl-lg">Service</th>
                    <th className="p-4">Booked By</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-t border-gray-200 cursor-pointer hover:bg-gray-100 transition duration-300 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-4 font-medium">{order.serviceName}</td>
                      <td className="p-4">{order.bookedBy}</td>
                      <td className="p-4">Rs.{order.price}</td>
                      <td className="p-4 font-semibold text-sm">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "On the way"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[400px] relative animate-scaleIn">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 transition duration-300"
              onClick={() => setSelectedOrder(null)}
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-900">
              {selectedOrder.serviceName}
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Provider:</strong> {selectedOrder.provider}
              </p>
              <p>
                <strong>Date & Time:</strong> {selectedOrder.dateTime}
              </p>
              <p>
                <strong>Location:</strong> {selectedOrder.location}
              </p>
              <p>
                <strong>Details:</strong> {selectedOrder.details}
              </p>
            </div>
            {selectedOrder.status !== "Completed" && (
              <div className="mt-4 flex flex-col space-y-2">
                {selectedOrder.status !== "On the way" && (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transform hover:scale-105 transition duration-300"
                    onClick={() => updateStatus(selectedOrder.id, "On the way")}
                  >
                    <Truck size={18} /> On the Way
                  </button>
                )}
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transform hover:scale-105 transition duration-300"
                  onClick={() => updateStatus(selectedOrder.id, "Completed")}
                >
                  <CheckCircle size={18} /> Completed
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default Order;
