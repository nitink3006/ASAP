import React, { useState, useEffect } from "react";
import { XCircle, CheckCircle, Truck, Ban } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Config from "../../Config";

const Order = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${Config.API_URL}/bookings?type=admin`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        const parsedOrders = data.orders.map((order) => ({
          ...order,
          services: JSON.parse(order.service.replace(/'/g, '"')),
        }));

        setOrders(parsedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${Config.API_URL}/bookings/${orderId}/update/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      const data = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                is_cancel: data.data.is_cancel,
                review: data.data.review,
                services: order.services.map((s) => ({
                  ...s,
                  status: newStatus,
                })),
              }
            : order
        )
      );
      setSelectedOrder(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${Config.API_URL}/bookings/${orderId}/update/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_cancel: true }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to cancel order: ${response.status}`);
      }

      const data = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                is_cancel: data.data.is_cancel,
                review: data.data.review,
                status: data.data.status,
              }
            : order
        )
      );
      setSelectedOrder(null);
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const getStatusColor = (status, isCancel) => {
    if (isCancel) return "bg-red-100 text-red-700";
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "On the way":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "";
    }
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

            {loading && (
              <div className="text-center text-blue-500 text-lg font-medium">
                Loading orders...
              </div>
            )}

            {error && (
              <div className="text-center text-red-500 text-lg font-medium">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-lg rounded-lg border-gray-200">
                  <thead>
                    <tr className="bg-gray-300 text-gray-700 text-left">
                      <th className="p-4 rounded-tl-lg">Service(s)</th>
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
                        <td className="p-4 font-medium">
                          {order.services
                            .map((s) => `${s.name} (x${s.quantity})`)
                            .join(", ")}
                        </td>
                        <td className="p-4">{order.name}</td>
                        <td className="p-4">${order.total_amount}</td>
                        <td className="p-4 font-semibold text-sm">
                          <span
                            className={`px-3 py-1 rounded-full ${getStatusColor(
                              order.status,
                              order.is_cancel
                            )}`}
                          >
                            {order.is_cancel ? "Cancelled" : order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center animate-fadeIn z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[640px] h-[90%] max-h-full overflow-y-auto relative animate-scaleIn max-w-full">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 transition duration-300 cursor-pointer"
              onClick={() => setSelectedOrder(null)}
            >
              <XCircle size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-900">
              Order by {selectedOrder.name}
            </h3>

            <div className="space-y-4 text-gray-700 mb-6">
              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>
              <p>
                <strong>Total:</strong> ${selectedOrder.total_amount}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {`${selectedOrder.flat_building}, ${selectedOrder.landmark}, ${selectedOrder.address}, ${selectedOrder.city} - ${selectedOrder.pincode}`}
              </p>
              <p>
                <strong>Payment:</strong> {selectedOrder.payment_method}
              </p>
              <p>
                <strong>Preferred Time:</strong>{" "}
                {selectedOrder.preferred_time || "Not specified"}
              </p>
            </div>

            <div className="bg-gray-100 px-4 py-3 rounded-lg mb-4">
              <p className="font-semibold text-gray-700 mb-1">
                Customer Review:
              </p>
              {selectedOrder.review ? (
                <p className="text-gray-600 italic">"{selectedOrder.review}"</p>
              ) : (
                <p className="text-gray-500 italic">No review available.</p>
              )}
            </div>

            <div className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg mb-4">
              <p className="font-semibold text-gray-700">
                Current Status:{" "}
                {selectedOrder.is_cancel ? "Cancelled" : selectedOrder.status}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <p className="font-semibold text-gray-700">Services:</p>
              {selectedOrder.services.map((service, index) => (
                <p key={index} className="text-gray-700">
                  <strong>
                    {service.name} (x{service.quantity})
                  </strong>{" "}
                  - ${service.price}
                </p>
              ))}
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              {!selectedOrder.is_cancel &&
                (selectedOrder.status === "Pending" ||
                  selectedOrder.status === "On the way") && (
                  <>
                    {selectedOrder.status === "Pending" && (
                      <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 flex items-center gap-1 cursor-pointer"
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "On the way")
                        }
                      >
                        <Truck size={18} /> On the Way
                      </button>
                    )}
                    <button
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transform hover:scale-105 transition duration-300 flex items-center gap-1 cursor-pointer"
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, "Completed")
                      }
                    >
                      <CheckCircle size={18} /> Completed
                    </button>
                    <button
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transform hover:scale-105 transition duration-300 flex items-center gap-1 cursor-pointer"
                      onClick={() => cancelOrder(selectedOrder.id)}
                    >
                      <Ban size={18} /> Cancel Order
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
