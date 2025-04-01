import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Config from "../../Config"; // Assuming you have a Config file with API_URL
import { FiTrash2, FiX } from "react-icons/fi";

const AddService = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for API data
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch services from API - Changed to GET method
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${Config.API_URL}/service-single/`, {
          method: "GET", // Changed from POST to GET
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle service selection
  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);

    if (serviceId) {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        // You can pre-fill other fields based on the selected service if needed
        setServiceName(service.name);
      }
    } else {
      setServiceName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the auth token
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Get the selected service object
      const selectedServiceObj = services.find((s) => s.id === selectedService);

      // Prepare data for API
      const formData = new FormData();
      formData.append("name", serviceName);
      formData.append("category_id", selectedServiceObj?.id || ""); // Use sub_category.id instead
      formData.append("price", price);
      formData.append("description", description);
      formData.append("duration", duration);
      formData.append("images", image);

      const response = await fetch(`${Config.API_URL}/services/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          // No Content-Type header for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Service added successfully:", responseData);

      // Clear form after successful submission
      setSelectedService("");
      setServiceName("");
      setPrice("");
      setDuration("");
      setDescription("");
      setImage(null);
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // You could add success notification here
      alert("Service added successfully!");
    } catch (err) {
      console.error("Error adding service:", err);
      // You could add error notification here
      alert(`Failed to add service: ${err.message}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
              Add Service
            </h2>

            {loading ? (
              <div className="text-center p-4">Loading services...</div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">Error: {error}</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Dropdown - Modified to show service-subcategory-category */}
                <label className="block">
                  <span className="text-gray-700 font-semibold">Service</span>
                  <select
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    value={selectedService}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} - {srv.category?.name || "No Subcategory"} -{" "}
                        {srv.category.category?.name || "No Category"}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Category Display - Second */}
                {selectedService && (
                  <label className="block">
                    <span className="text-gray-700 font-semibold">
                      Category
                    </span>
                    <input
                      type="text"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                      value={
                        services.find((s) => s.id === selectedService)?.category
                          ?.category.name || ""
                      }
                      readOnly
                    />
                  </label>
                )}

                {/* Subcategory Display - Third */}
                {selectedService && (
                  <label className="block">
                    <span className="text-gray-700 font-semibold">
                      Subcategory
                    </span>
                    <input
                      type="text"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                      value={
                        services.find((s) => s.id === selectedService)?.category
                          ?.name || ""
                      }
                      readOnly
                    />
                  </label>
                )}

                {/* Service Name Field */}
                <label className="block">
                  <span className="text-gray-700 font-semibold">
                    Service Name
                  </span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="Enter service name"
                    required
                  />
                </label>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-gray-700 font-semibold">
                      Price ($)
                    </span>
                    <input
                      type="number"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700 font-semibold">
                      Duration (mins)
                    </span>
                    <input
                      type="number"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                    />
                  </label>
                </div>

                {/* Description */}
                <label className="block">
                  <span className="text-gray-700 font-semibold">
                    Description
                  </span>
                  <textarea
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </label>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Upload Image
                  </label>
                  <div className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                    />
                  </div>

                  {preview && (
                    <div
                      className="mt-4 relative w-32 cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                {isModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800"
                      >
                        <FiX size={20} />
                      </button>
                      <img
                        src={preview}
                        alt="Full Preview"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700 transition duration-300"
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;
