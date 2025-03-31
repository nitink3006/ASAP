import React, { useState, useEffect, useRef } from "react";
import {
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Config from "../../Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubCategory = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const editFileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setEditImage(file);
        setEditPreview(URL.createObjectURL(file));
      } else {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = (isEdit = false) => {
    if (isEdit) {
      setEditImage(null);
      setEditPreview("");
      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
    } else {
      setImage(null);
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleEdit = (subCategory) => {
    setEditingSubCategory(subCategory);
    setEditName(subCategory.name);
    setEditCategoryId(subCategory.category.id);
    setEditPreview(subCategory.images);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", editName);
    formData.append("category_id", editCategoryId);
    if (editImage) {
      formData.append("images", editImage);
    }

    try {
      const response = await fetch(
        `${Config.API_URL}/sub-service-categories/${editingSubCategory.id}/`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Sub-category updated successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        setIsEditModalOpen(false);
        fetchSubCategories();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update sub-category", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedCategoryId) {
      setError("Please select a category");
      toast.error("Please select a category", {
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("category_id", selectedCategoryId);
    if (image) {
      formData.append("images", image);
    }

    try {
      const response = await fetch(
        `${Config.API_URL}/sub-service-categories/`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Sub-category added successfully!", {
          position: "top-right",
          autoClose: 1000,
        });

        setCategoryName("");
        setSelectedCategoryId("");
        setImage(null);
        setPreview("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        fetchSubCategories();
      } else {
        let errorMessage = "Failed to add sub-category.";

        if (data.category_id) {
          errorMessage = `Category error: ${data.category_id.join(", ")}`;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === "object") {
          const firstError = Object.values(data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError.join(", ");
          }
        }

        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Request error:", err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/sub-service-categories/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        setSubCategories(
          subCategories.filter((subCategory) => subCategory.id !== id)
        );
        toast.success("Sub-category deleted successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error("Failed to delete sub-category.", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };

  const fetchCategories = async () => {
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
      console.error("Error fetching categories:", error);
      setError(error.message);
    }
  };

  const fetchSubCategories = async () => {
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
      console.error("Error fetching sub-categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const filteredSubCategories = (subCategories || []).filter(
    (subCat) =>
      subCat?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subCat?.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSubCategories = filteredSubCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading && categories.length === 0 && subCategories.length === 0) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error && categories.length === 0 && subCategories.length === 0) {
    return <div className="text-center p-6 text-red-600">Error: {error}</div>;
  }

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
          <div className="p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
              Add New Sub-Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Sub-Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  placeholder="Enter Sub-Category Name"
                  required
                />
              </div>
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
                  <div className="mt-4 relative w-32">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(false)}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
              >
                Add Sub-Category
              </button>
            </form>
          </div>

          {/* Search & Table */}
          <div className="p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-10 mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Sub-Categories
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
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
              <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Sub-Category</th>
                    <th className="p-4 text-center">Image</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSubCategories.length > 0 ? (
                    displayedSubCategories.map((subCat) => (
                      <tr
                        key={subCat.id}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="p-4">
                          {subCat.category?.name || "N/A"}
                        </td>
                        <td className="p-4">{subCat.name}</td>
                        <td className="p-4 text-center">
                          <img
                            src={subCat.images}
                            alt="Sub-Category"
                            className="w-12 h-12 rounded-lg mx-auto object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48";
                            }}
                          />
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(subCat)}
                              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(subCat.id)}
                              className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition cursor-pointer"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No sub-categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 mx-1 rounded-md cursor-pointer ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  <FiChevronLeft />
                </button>
                <span className="flex items-center px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 mx-1 rounded-md cursor-pointer ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Sub-Category</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Category
                </label>
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Sub-Category Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  placeholder="Enter Sub-Category Name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Update Image
                </label>
                <div className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, true)}
                    ref={editFileInputRef}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  />
                </div>
                {editPreview && (
                  <div className="mt-4 relative w-32">
                    <img
                      src={editPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(true)}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategory;
