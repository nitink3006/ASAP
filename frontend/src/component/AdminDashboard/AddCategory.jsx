import React, { useState, useEffect, useRef } from "react";
import {
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  console.log("Data", S);

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

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", categoryName);
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
        setImage(null);
        setPreview("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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

  const handleDelete = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  // Ensure categories is an array and filter safely
  const filteredCategories = (categories || []).filter(
    (cat) =>
      cat?.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    fetch(`${Config.API_URL}/service-categories/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      })
      .then((data) => {
        // Transform the data to match expected structure
        const transformedData = data.map((cat) => ({
          id: cat.id,
          category: cat.name, // Change 'name' to 'category' as expected in JSX
          image: cat.images, // Change 'images' to 'image' as expected in JSX
        }));

        setCategories(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError(error.message);
        setLoading(false);
      });
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
                      onClick={removeImage}
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
                Add Category
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
                        <td className="p-4 text-center">
                          <img
                            src={cat.image}
                            alt="Category"
                            className="w-12 h-12 rounded-lg mx-auto"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                          >
                            <FiTrash2 />
                          </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
