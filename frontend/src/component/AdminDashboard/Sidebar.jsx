import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FolderIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <>
      <ToastContainer />
      <aside
        className={`bg-[#4A5565] text-white fixed top-0 left-0 w-64 h-screen p-4 flex flex-col transition-transform duration-300 z-50 ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-2 rounded-md mb-7">
          <span className="text-2xl font-bold text-white">ASAP</span>
          <button onClick={toggleSidebar} className="text-white md:hidden">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow space-y-3">
          <NavLink
            to="/order"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded transition-colors duration-300 ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-[#6B7280]"
              }`
            }
          >
            <DocumentTextIcon className="h-5 w-5 mr-2 text-black" />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/add-category"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded transition-colors duration-300 ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-[#6B7280]"
              }`
            }
          >
            <PlusIcon className="h-5 w-5 mr-2 text-black" />
            <span>Add Category</span>
          </NavLink>

          <NavLink
            to="/sub-category"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded transition-colors duration-300 ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-[#6B7280]"
              }`
            }
          >
            <PlusIcon className="h-5 w-5 mr-2 text-black" />
            <span>Sub Category</span>
          </NavLink>

          <NavLink
            to="/service"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded transition-colors duration-300 ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-[#6B7280]"
              }`
            }
          >
            <FolderIcon className="h-5 w-5 mr-2 text-black" />
            <span>Service</span>
          </NavLink>

          <NavLink
            to="/add-service"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded transition-colors duration-300 ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-[#6B7280]"
              }`
            }
          >
            <FolderIcon className="h-5 w-5 mr-2 text-black" />
            <span>Add Service</span>
          </NavLink>

          <NavLink
            to="/remove-service"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded transition-colors duration-300 ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-[#6B7280]"
              }`
            }
          >
            <TrashIcon className="h-5 w-5 mr-2 text-black" />
            <span>Remove Service</span>
          </NavLink>

          {/* Separator */}
          <hr className="my-4 border-t border-white opacity-50" />
        </nav>

        {/* Footer Buttons */}
        <div className="mt-auto flex flex-col mb-20 md:mb-0">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center mt-2 cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
