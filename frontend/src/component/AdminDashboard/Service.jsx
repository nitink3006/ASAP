import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiTrash2, FiSearch, FiX, FiEdit2, FiSave } from "react-icons/fi";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Config from "../../Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Service = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceImage, setServiceImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Improved state for categories and subcategories
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullImagePreview, setFullImagePreview] = useState("");

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // Centralized error handling
  const handleError = useCallback((errorMessage) => {
    console.error(errorMessage);
    toast.error(errorMessage);
    setError(errorMessage);
  }, []);

  // Fetch main categories with improved error handling
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${Config.API_URL}/service-categories/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      handleError(error.message);
    }
  }, [token, handleError]);

  const fetchSubCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${Config.API_URL}/sub-service-categories/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sub-categories");
      }

      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  // Fetch services with improved error handling
  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`${Config.API_URL}/service-single/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to load services");
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      handleError("Failed to load services");
    }
  }, [token, handleError]);

  // Unified data fetching
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchServices();
  }, [fetchCategories, fetchSubCategories, fetchServices]);

  // Image handling with improved validation
  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      // Image type and size validation
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload JPEG, PNG, or GIF.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      if (isEdit) {
        setEditingService((prev) => ({
          ...prev,
          newImage: file,
          previewImage: URL.createObjectURL(file),
        }));
      } else {
        setServiceImage(file);
        setPreview(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = (isEdit = false) => {
    if (isEdit) {
      setEditingService((prev) => ({
        ...prev,
        newImage: null,
        previewImage: prev.images,
      }));
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    } else {
      setServiceImage(null);
      setPreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCategoryChange = (e, isEdit = false) => {
    const selectedCategory = e.target.value;
    if (isEdit) {
      setEditingService((prev) => ({
        ...prev,
        category: { name: selectedCategory },
        sub_category: { name: "" },
      }));
    } else {
      setCategory(selectedCategory);
      setSubcategory("");
    }
  };

  // Improved submit handler with robust error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!serviceName.trim()) {
      toast.error("Service name cannot be empty");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!subcategory) {
      toast.error("Please select a subcategory");
      return;
    }

    setLoading(true);
    setError("");

    // Find the category ID
    const selectedCategoryObj = categories.find((cat) => cat.name === category);
    const categoryId = selectedCategoryObj ? selectedCategoryObj.id : null;

    // Find the subcategory ID
    const selectedSubcategoryObj = getFilteredSubcategories(category).find(
      (subcat) => subcat.name === subcategory
    );
    const subcategoryId = selectedSubcategoryObj
      ? selectedSubcategoryObj.id
      : null;

    if (!categoryId) {
      toast.error("Invalid category selected");
      setLoading(false);
      return;
    }

    if (!subcategoryId) {
      toast.error("Invalid subcategory selected");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", serviceName);
    // formData.append("category_id", categoryId);
    formData.append("category_id", subcategoryId);
    if (serviceImage) formData.append("images", serviceImage);

    try {
      const response = await fetch(`${Config.API_URL}/service-single/`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        toast.success("Service added successfully!");
        // Reset form
        setServiceName("");
        setCategory("");
        setSubcategory("");
        removeImage();

        // Refresh services list
        fetchServices();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add service");
      }
    } catch (error) {
      handleError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Start editing a service
  const startEditing = (service) => {
    setEditingService({
      ...service,
      previewImage: service.images,
      newImage: null,
    });
    setIsEditModalOpen(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", editingService.name);

      // Find category and subcategory IDs
      const selectedCategory = categories.find(
        (cat) => cat.name === editingService.category.name
      );
      const selectedSubcategory = subCategories.find(
        (subcat) =>
          subcat.name === editingService.sub_category.name &&
          subcat.category.name === editingService.category.name
      );

      if (selectedCategory) formData.append("category_id", selectedCategory.id);
      if (selectedSubcategory)
        formData.append("sub_category_id", selectedSubcategory.id);
      if (editingService.newImage)
        formData.append("images", editingService.newImage);

      const response = await fetch(
        `${Config.API_URL}/service-single/${editingService.id}/`,
        {
          method: "PUT",
          body: formData,
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.ok) {
        toast.success("Service updated successfully!");
        setIsEditModalOpen(false);
        fetchServices();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update service");
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get filtered subcategories for a category
  const getFilteredSubcategories = (categoryName) => {
    return subCategories.filter(
      (subcat) => subcat.category.name === categoryName
    );
  };

  // Open full image preview
  const openFullImagePreview = (imageSrc) => {
    setFullImagePreview(imageSrc);
    setIsModalOpen(true);
  };

  // Filter services based on search query
  const filteredServices = services.filter((srv) =>
    srv.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <ToastContainer />

          {/* Service Creation Form */}
          <div className="p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
              Add New Service
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Name Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter service name"
                  required
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e, false)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Subcategory
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400"
                  disabled={!category}
                  required
                >
                  <option value="">
                    {category
                      ? getFilteredSubcategories(category).length === 0
                        ? "No subcategories found"
                        : "Select Subcategory"
                      : "Select a category first"}
                  </option>
                  {getFilteredSubcategories(category).map((subcat) => (
                    <option key={subcat.id} value={subcat.name}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Image
                </label>
                <div className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={(e) => handleImageChange(e, false)}
                    ref={fileInputRef}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  />
                </div>
                {preview && (
                  <div
                    className="mt-4 relative w-32 cursor-pointer"
                    onClick={() => openFullImagePreview(preview)}
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
                        removeImage(false);
                      }}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gray-700 text-white p-3 rounded-lg cursor-pointer hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Service"}
              </button>
            </form>
          </div>

          {/* Services Table */}
          <div className="p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-10 mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Services</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
                <FiSearch
                  className="absolute left-3 top-2.5 text-gray-500"
                  size={20}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 text-left">Service</th>
                    <th className="p-4 text-center">Category</th>
                    <th className="p-4 text-center">Subcategory</th>
                    <th className="p-4 text-center">Image</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((srv) => (
                      <tr key={srv.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{srv.name}</td>
                        <td className="p-4 text-center">
                          {srv.category.category?.name || "N/A"}
                        </td>
                        <td className="p-4 text-center">
                          {srv.category?.name || "N/A"}
                        </td>
                        <td className="p-4 text-center">
                          <img
                            src={srv.images}
                            alt="Service"
                            onClick={() => openFullImagePreview(srv.images)}
                            className="w-12 h-12 rounded-lg mx-auto cursor-pointer hover:opacity-75 transition-opacity object-cover"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => startEditing(srv)}
                              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">
                        No services found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Service Modal */}
      {isEditModalOpen && editingService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Service</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Service Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  value={editingService.category.name}
                  onChange={(e) => handleCategoryChange(e, true)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Subcategory
                </label>
                <select
                  value={editingService.sub_category.name}
                  onChange={(e) =>
                    setEditingService((prev) => ({
                      ...prev,
                      sub_category: { name: e.target.value },
                    }))
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {getFilteredSubcategories(editingService.category.name).map(
                    (subcat) => (
                      <option key={subcat.id} value={subcat.name}>
                        {subcat.name}
                      </option>
                    )
                  )}
                </select>
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
                    onChange={(e) => handleImageChange(e, true)}
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
                        onClick={() => removeImage(true)}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center cursor-pointer"
                  disabled={loading}
                >
                  <FiSave className="mr-2" />
                  {loading ? "Updating..." : "Update Service"}
                </button>
              </div>
              {/* <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Service"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div> */}
            </form>
          </div>
        </div>
      )}

      {/* Full Image Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 z-60"
            >
              <FiX size={20} />
            </button>
            <img
              src={fullImagePreview}
              alt="Full Preview"
              className="w-full h-auto rounded-lg object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
