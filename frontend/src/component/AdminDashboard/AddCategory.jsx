import React, { useState, useEffect, useRef } from "react";
import {
  FiTrash2,
  FiSearch,
  FiX,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
  FiSave,
} from "react-icons/fi";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Config from "../../Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategory = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;

  const [categories, setCategories] = useState([]);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeEditImage = () => {
    setEditImage(null);
    setEditPreview("");
  };

  const handleEdit = (category) => {
    setEditingCategory({
      ...category,
      name: category.category,
    });
    setEditPreview(category.image);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", editingCategory.name);
    formData.append("zip_code", editingCategory.zipcode);
    if (editImage) {
      formData.append("images", editImage);
    }

    try {
      const response = await fetch(
        `${Config.API_URL}/service-categories/${editingCategory.id}/`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Category updated successfully!", {
          position: "top-right",
          autoClose: 1000,
        });

        // Update categories list
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id
              ? {
                  ...cat,
                  category: editingCategory.name,
                  zipcode: editingCategory.zipcode,
                  image: editPreview || cat.image,
                }
              : cat
          )
        );

        setIsEditModalOpen(false);
        setEditingCategory(null);
        setEditImage(null);
        setEditPreview("");
      } else {
        toast.error(data.message || "Failed to update category.", {
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

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("zip_code", zipCode);
    if (image) {
      formData.append("images", image);
    }

    try {
      const response = await fetch(`${Config.API_URL}/service-categories/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Category added successfully!", {
          position: "top-right",
          autoClose: 1000,
        });

        // Reset form
        setCategoryName("");
        setZipCode("");
        setImage(null);
        setPreview("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Refresh categories
        fetchCategories();
      } else {
        setError(data.message || "Failed to add category.");
        toast.error(data.message || "Failed to add category.", {
          position: "top-right",
        });
      }
    } catch (err) {
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
        `${Config.API_URL}/service-categories/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Category deleted successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        setCategories(categories.filter((category) => category.id !== id));
      } else {
        toast.error("Failed to delete category.", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };

  const filteredCategories = (categories || []).filter(
    (cat) =>
      cat?.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat?.zipcode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
      const transformedData = data.map((cat) => ({
        id: cat.id,
        category: cat.name,
        image: cat.images,
        zipcode: cat.zip_code || "",
      }));

      setCategories(transformedData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading && categories.length === 0) {
    return <div className="text-center p-6">Loading categories...</div>;
  }

  if (error && categories.length === 0) {
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
              Add New Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  placeholder="Enter zip code"
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

              <button
                type="submit"
                className="w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
              >
                {loading ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>

          {/* Search & Table */}
          <div className="p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Categories</h3>
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
                    <th className="p-4 text-center">Zip Code</th>
                    <th className="p-4 text-center">Image</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCategories.length > 0 ? (
                    displayedCategories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="p-4">{cat.category}</td>
                        <td className="p-4 text-center">{cat.zipcode}</td>
                        <td className="p-4 text-center">
                          <img
                            src={cat.image}
                            alt="Category"
                            className="w-12 h-12 rounded-lg mx-auto object-cover cursor-pointer"
                            onClick={() => {
                              setPreview(cat.image);
                              setIsModalOpen(true);
                            }}
                          />
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(cat)}
                              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
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
                        No Categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                  <FiChevronLeft />
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
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

      {/* Edit Modal */}
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingCategory(null);
                setEditImage(null);
                setEditPreview("");
              }}
              className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 cursor-pointer"
            >
              <FiX size={20} />
            </button>
            <h3 className="text-2xl font-bold mb-4">Edit Category</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={editingCategory.zipcode}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      zipcode: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Update Image
                </label>
                <div className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
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
                    {editImage && (
                      <button
                        type="button"
                        onClick={removeEditImage}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingCategory(null);
                    setEditImage(null);
                    setEditPreview("");
                  }}
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
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCategory;
