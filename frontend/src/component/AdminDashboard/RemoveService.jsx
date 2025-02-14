import React, { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const RemoveService = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;

  // Dummy data
  const [services, setServices] = useState([
    {
      category: "Web Development",
      serviceName: "Frontend",
      price: "5000",
      duration: "60",
    },
    {
      category: "Graphic Design",
      serviceName: "Logo Design",
      price: "3000",
      duration: "45",
    },
    {
      category: "Digital Marketing",
      serviceName: "SEO",
      price: "7000",
      duration: "90",
    },
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const handleDelete = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  // Search filter
  const filteredServices = services.filter((service) =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
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
            <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Service Name</th>
                  <th className="py-3 px-6 text-left">Price (₹)</th>
                  <th className="py-3 px-6 text-left">Duration (mins)</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentServices.length > 0 ? (
                  currentServices.map((service, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="py-3 px-6">{service.category}</td>
                      <td className="py-3 px-6">{service.serviceName}</td>
                      <td className="py-3 px-6">₹{service.price}</td>
                      <td className="py-3 px-6">{service.duration} mins</td>
                      <td className="py-3 px-6">
                        <button
                          className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-700 flex items-center justify-center"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No services found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {Array.from(
                {
                  length: Math.ceil(filteredServices.length / servicesPerPage),
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveService;
