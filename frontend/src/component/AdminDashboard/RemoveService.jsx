import React, { useState, useEffect, useRef } from "react";
import { Trash2, Search, Eye, Edit2 } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Config from "../../Config";

const RemoveService = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const editFileInputRef = useRef(null);
  const servicesPerPage = 5;

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
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
      const servicesData = Array.isArray(data) ? data : [data];
      setServices(servicesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(`Failed to fetch services: ${err.message}`);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const viewServiceDetails = (service) => {
    setSelectedService(service);
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  const startEditing = (service) => {
    setEditingService({
      ...service,
      previewImage: service.images,
      newImage: null,
    });
  };

  const closeEditing = () => {
    setEditingService(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingService((prev) => ({
      ...prev,
      [name]: name === "price" || name === "duration" ? Number(value) : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingService((prev) => ({
        ...prev,
        previewImage: reader.result,
        newImage: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setEditingService((prev) => ({
      ...prev,
      previewImage: null,
      newImage: null,
    }));
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const handleSaveEdit = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const formData = new FormData();
      formData.append("name", editingService.name);
      formData.append("price", editingService.price.toString());
      formData.append("duration", editingService.duration.toString());

      // Correcting category_id assignment
      const categoryId =
        editingService.category?.id || editingService.category?.id;
      if (!categoryId) {
        throw new Error("Category ID not found");
      }
      formData.append("category_id", categoryId);

      if (editingService.description) {
        formData.append("description", editingService.description);
      }
      if (editingService.newImage) {
        formData.append("images", editingService.newImage);
      }

      const response = await fetch(
        `${Config.API_URL}/services/${editingService.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedService = await response.json();
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === updatedService.id ? updatedService : service
        )
      );
      closeEditing();
      if (selectedService?.id === updatedService.id) {
        setSelectedService(updatedService);
      }
    } catch (err) {
      setError("Failed to update service: " + err.message);
      console.error("Error updating service:", err);
    }
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

      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== id)
      );

      if (selectedService?.id === id) {
        setSelectedService(null);
      }
    } catch (err) {
      setError("Failed to delete service: " + err.message);
      console.error("Error deleting service:", err);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Manage Services
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
                                className="bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-700 flex items-center justify-center cursor-pointer"
                                onClick={() => viewServiceDetails(service)}
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="bg-yellow-500 text-white px-3 py-2 rounded-full hover:bg-yellow-700 flex items-center justify-center cursor-pointer"
                                onClick={() => startEditing(service)}
                                title="Edit Service"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-700 flex items-center justify-center cursor-pointer"
                                onClick={() => handleDelete(service.id)}
                                title="Delete Service"
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
                      className="text-gray-500 hover:text-gray-800 cursor-pointer"
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
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
                      onClick={closeServiceDetails}
                    >
                      Close
                    </button>
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          startEditing(selectedService);
                          closeServiceDetails();
                        }}
                      >
                        <Edit2 size={16} />
                        Edit Service
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          handleDelete(selectedService.id);
                          closeServiceDetails();
                        }}
                      >
                        <Trash2 size={16} />
                        Delete Service
                      </button>
                    </div>
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

            {/* Edit Service Modal */}
            {editingService && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Edit Service</h3>
                    <button
                      onClick={closeEditing}
                      className="text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="name"
                      >
                        Service Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editingService.name}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="description"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editingService.description || ""}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="price"
                        >
                          Price ($)
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={editingService.price}
                          onChange={handleEditChange}
                          min="0"
                          step="0.01"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="duration"
                        >
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          id="duration"
                          name="duration"
                          value={editingService.duration}
                          onChange={handleEditChange}
                          min="0"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Service Image
                      </label>
                      <div className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          onChange={handleImageChange}
                          ref={editFileInputRef}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                        />
                      </div>
                      {editingService.previewImage && (
                        <div className="mt-4 relative w-32">
                          <img
                            src={editingService.previewImage}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
                          />
                          {editingService.newImage && (
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      onClick={closeEditing}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={handleSaveEdit}
                    >
                      Save Changes
                    </button>
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
