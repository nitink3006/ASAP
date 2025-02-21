import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AddService = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [category, setCategory] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState("");

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceData = {
      category,
      serviceName,
      price,
      duration,
      description,
      rating,
      reviewCount,
    };
    console.log("Submitted Service Data:", serviceData);
    // Here, you can send the data to your backend API
  };

  const handleStarClick = (index) => {
    setRating((prev) => (prev === index + 1 ? 0 : index + 1));
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className="text-gray-700 font-semibold">Category</span>
                <select
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Hair">Hair</option>
                  <option value="Skin">Skin</option>
                  <option value="Massage">Massage</option>
                  <option value="Nails">Nails</option>
                </select>
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">
                  Service Name
                </span>
                <input
                  type="text"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-700 font-semibold">Price (₹)</span>
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

              <label className="block">
                <span className="text-gray-700 font-semibold">Description</span>
                <textarea
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </label>

              <div className="block">
                <span className="text-gray-700 font-semibold">Reviews</span>
                <div className="flex items-center mt-2 space-x-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`cursor-pointer ${
                        index < rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      onClick={() => handleStarClick(index)}
                    />
                  ))}
                  <input
                    type="number"
                    className="ml-4 p-2 border border-gray-300 rounded-md w-20 focus:ring focus:ring-blue-300"
                    placeholder="4.85"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;
