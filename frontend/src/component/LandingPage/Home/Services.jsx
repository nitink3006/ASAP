import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Config from "../../../Config";
import spa from "../../../assets/spa.jpeg";

const Services = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch services from API
        const fetchServices = async () => {
            try {
                const response = await fetch(
                    `${Config.API_URL}/service-categories/`
                );
                const data = await response.json();
                const storedZip = localStorage.getItem("zip_code");

                // Filter services based on zip code
                const filteredServices =
                    storedZip && storedZip !== "null"
                        ? data.filter(
                              (service) =>
                                  service.zip_code === storedZip ||
                                  service.zip_code === "0"
                          )
                        : data;

                setServices(filteredServices);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        if (selectedService) {
            document.documentElement.style.overflow = "hidden";

            const fetchSubCategories = async () => {
                try {
                    const response = await fetch(
                        `${Config.API_URL}/sub-service-categories/retrieve-by-id/?service_id=${selectedService.id}`
                    );
                    const data = await response.json();
                    const category = data.data;
                    setSubCategories(category);
                } catch (error) {
                    console.error(
                        "Error fetching sub-service categories:",
                        error
                    );
                }
            };
            fetchSubCategories();
        } else {
            document.documentElement.style.overflow = "auto";
        }

        return () => {
            document.documentElement.style.overflow = "auto";
        };
    }, [selectedService]);

    const handleSubCategoryClick = (subCategory) => {
        navigate("/service-page", {
            state: {
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                subCategoryId: subCategory.id,
                subCategoryName: subCategory.name,
            },
        });
    };

    return (
        <div className="bg-white py-12 px-6 lg:px-24 relative">
            {/* Main Heading */}
            <h1 className="text-4xl font-bold text-gray-900 text-center">
                Our Services
            </h1>
            <p className="text-lg text-gray-600 text-center mt-2">
                What are you looking for?
            </p>

            {/* Services Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
                {services.map((service, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedService(service)}
                        className="bg-gray-100 p-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-center relative group"
                    >
                        <img
                            src={service.images}
                            alt={service.name}
                            className="w-20 h-20 mx-auto object-cover"
                        />
                        <p className="text-gray-800 font-medium mt-3 text-sm">
                            {service.name}
                        </p>
                        {/* Black Line on Hover */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-black transition-all group-hover:w-3/4"></div>
                    </div>
                ))}
            </div>

            {selectedService && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-[1px]">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full border-2 border-gray-300 relative">
                        {/* Close Icon */}
                        <button
                            className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
                            onClick={() => setSelectedService(null)}
                        >
                            <FaTimes size={24} />
                        </button>

                        <h2 className="text-2xl font-semibold text-center">
                            {selectedService.name}
                        </h2>

                        {/* Display Subcategories */}
                        <div className="grid grid-cols-3 gap-4 mt-3">
                            {subCategories.length > 0 ? (
                                subCategories.map((item, i) => (
                                    <div
                                        key={i}
                                        className="text-center cursor-pointer"
                                        onClick={() =>
                                            handleSubCategoryClick(item)
                                        }
                                    >
                                        <div className="bg-gray-200 p-2 rounded-lg">
                                            <img
                                                src={spa}
                                                alt={item.name}
                                                className="w-12 h-12 mx-auto rounded-md"
                                            />
                                        </div>
                                        <p className="text-gray-700 text-sm mt-1">
                                            {item.name}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center mt-2">
                                    No subcategories found
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
