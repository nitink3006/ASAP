import React, { useState, useEffect } from "react";
import { Trash2, Search, Eye } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Config from "../../Config"; // Make sure this import path is correct

const RemoveService = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const servicesPerPage = 5;

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        const response = await fetch(`${Config.API_URL}/services/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // If data is an array, use it directly, otherwise wrap it in an array
        const servicesData = Array.isArray(data) ? data : [data];
        setServices(servicesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(`Failed to fetch services: ${err.message}`);

        // Clear services array on error
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const viewServiceDetails = (service) => {
    setSelectedService(service);
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${Config.API_URL}/services/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update the services state after successful deletion
      const updatedServices = services.filter((service) => service.id !== id);
      setServices(updatedServices);

      // If the deleted service is currently being viewed, close the details
      if (selectedService && selectedService.id === id) {
        setSelectedService(null);
      }
    } catch (err) {
      setError("Failed to delete service: " + err.message);
      console.error("Error deleting service:", err);
    }
  };

  // Search filter - search by service name
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );

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
          <div className="p-8 max-w-6xl mx-auto rounded-lg shadow-lg bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-extrabold text-gray-900">
                Remove Service
              </h2>
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : (
              <>
                <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="py-3 px-6 text-left">Image</th>
                      <th className="py-3 px-6 text-left">Service Name</th>
                      <th className="py-3 px-6 text-left">Category</th>
                      <th className="py-3 px-6 text-left">Price ($)</th>
                      <th className="py-3 px-6 text-left">Duration (mins)</th>
                      <th className="py-3 px-6 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentServices.length > 0 ? (
                      currentServices.map((service) => (
                        <tr
                          key={service.id}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="py-3 px-6">
                            {service.images ? (
                              <img
                                src={service.images}
                                alt={service.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  No image
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-6">{service.name}</td>
                          <td className="py-3 px-6">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {service.category?.name || "N/A"}
                              </span>
                              {service.category?.category?.name && (
                                <span className="text-xs text-gray-500">
                                  {service.category.category.name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-6">${service.price}</td>
                          <td className="py-3 px-6">{service.duration} mins</td>
                          <td className="py-3 px-6">
                            <div className="flex space-x-2">
                              <button
                                className="bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
                                onClick={() => viewServiceDetails(service)}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-700 flex items-center justify-center"
                                onClick={() => handleDelete(service.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-4 text-center text-gray-500"
                        >
                          No services found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {filteredServices.length > servicesPerPage && (
                  <div className="flex justify-center mt-4">
                    {Array.from(
                      {
                        length: Math.ceil(
                          filteredServices.length / servicesPerPage
                        ),
                      },
                      (_, i) => (
                        <button
                          key={i}
                          className={`px-4 py-2 mx-1 border rounded ${
                            currentPage === i + 1
                              ? "bg-gray-600 text-white"
                              : "bg-gray-200"
                          }`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}

            {/* Service Detail Modal */}
            {selectedService && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">
                      {selectedService.name}
                    </h3>
                    <button
                      onClick={closeServiceDetails}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {selectedService.images ? (
                        <img
                          src={selectedService.images}
                          alt={selectedService.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">
                            No image available
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold">Categories</h4>
                        <div className="flex flex-col gap-1 mt-1">
                          {selectedService.category?.category?.name && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                Main Category:
                              </span>
                              <span>
                                {selectedService.category.category.name}
                              </span>
                            </div>
                          )}
                          {selectedService.category?.name && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Sub Category:</span>
                              <span>{selectedService.category.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">Price</h4>
                        <p className="text-xl font-bold text-gray-800">
                          ${selectedService.price}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">Duration</h4>
                        <p>{selectedService.duration} minutes</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">Description</h4>
                        <p className="text-gray-700">
                          {selectedService.description ||
                            "No description provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                      onClick={closeServiceDetails}
                    >
                      Close
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                      onClick={() => {
                        handleDelete(selectedService.id);
                        closeServiceDetails();
                      }}
                    >
                      <Trash2 size={16} />
                      Delete Service
                    </button>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">
                      Category Images
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedService.category?.images && (
                        <div>
                          <span className="text-sm text-gray-500">
                            Sub Category Image
                          </span>
                          <img
                            src={selectedService.category.images}
                            alt={`${selectedService.category.name} image`}
                            className="w-full h-32 object-cover rounded-lg mt-1"
                          />
                        </div>
                      )}

                      {selectedService.category?.category?.images && (
                        <div>
                          <span className="text-sm text-gray-500">
                            Main Category Image
                          </span>
                          <img
                            src={selectedService.category.category.images}
                            alt={`${selectedService.category.category.name} image`}
                            className="w-full h-32 object-cover rounded-lg mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveService;
