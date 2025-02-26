import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";

const services = [
  {
    name: "Women's Salon & Spa",
    image: "https://cdn-icons-png.flaticon.com/128/1752/1752032.png",
    categories: [
      {
        title: "Hair Services",
        items: [
          {
            name: "Haircut",
            image: "https://cdn-icons-png.flaticon.com/128/1881/1881974.png",
          },
          {
            name: "Hair Spa",
            image: "https://cdn-icons-png.flaticon.com/128/1492/1492574.png",
          },
          {
            name: "Hair Coloring",
            image: "https://cdn-icons-png.flaticon.com/128/3397/3397926.png",
          },
        ],
      },
      {
        title: "Skin & Beauty",
        items: [
          {
            name: "Facial",
            image: "https://cdn-icons-png.flaticon.com/128/1785/1785889.png",
          },
          {
            name: "Manicure",
            image: "https://cdn-icons-png.flaticon.com/128/10750/10750762.png",
          },
          {
            name: "Pedicure",
            image: "https://cdn-icons-png.flaticon.com/128/10750/10750761.png",
          },
        ],
      },
    ],
  },
  {
    name: "Men's Salon & Massage",
    image: "https://cdn-icons-png.flaticon.com/128/10036/10036872.png",
    categories: [
      {
        title: "Hair & Grooming",
        items: [
          {
            name: "Haircut",
            image: "https://cdn-icons-png.flaticon.com/128/1881/1881974.png",
          },
          {
            name: "Shaving",
            image: "https://cdn-icons-png.flaticon.com/128/3094/3094166.png",
          },
          {
            name: "Beard Styling",
            image: "https://cdn-icons-png.flaticon.com/128/3075/3075711.png",
          },
        ],
      },
      {
        title: "Massage",
        items: [
          {
            name: "Body Massage",
            image: "https://cdn-icons-png.flaticon.com/128/1705/1705553.png",
          },
          {
            name: "Head Massage",
            image: "https://cdn-icons-png.flaticon.com/128/1898/1898739.png",
          },
        ],
      },
    ],
  },
  {
    name: "AC & Appliance Repair",
    image: "https://cdn-icons-png.flaticon.com/128/5361/5361406.png",
  },
  {
    name: "Cleaning & Pest Control",
    image: "https://cdn-icons-png.flaticon.com/128/1135/1135267.png",
  },
  {
    name: "Electrician",
    image: "https://cdn-icons-png.flaticon.com/128/307/307943.png",
  },
  {
    name: "Plumber",
    image: "https://cdn-icons-png.flaticon.com/128/3842/3842469.png",
  },
  {
    name: "Carpenter",
    image: "https://cdn-icons-png.flaticon.com/128/10059/10059750.png",
  },
  {
    name: "Native Water Purifier",
    image: "https://cdn-icons-png.flaticon.com/128/5401/5401708.png",
  },
  {
    name: "Rooms/Walls Painting",
    image: "https://cdn-icons-png.flaticon.com/128/2954/2954727.png",
  },
  {
    name: "Wall Panels",
    image: "https://cdn-icons-png.flaticon.com/128/802/802890.png",
  },
  {
    name: "Home Deep Cleaning",
    image: "https://cdn-icons-png.flaticon.com/128/2731/2731285.png",
  },
  {
    name: "CCTV & Security",
    image: "https://cdn-icons-png.flaticon.com/128/8334/8334315.png",
  },
];

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  useEffect(() => {
    if (selectedService) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [selectedService]);

  return (
    <div className="bg-white min-h-screen py-12 px-6 lg:px-24 relative">
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
              src={service.image}
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

      {/* Transparent Modal */}
      {/* Transparent Modal */}
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

            {/* Categories List */}
            {selectedService.categories?.map((category, index) => (
              <div key={index} className="mt-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-extralight">{category.title}</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  {category.items.map((item, i) => (
                    <div key={i} className="text-center">
                      <Link to="/service-page">
                        <div className="bg-gray-200 p-2 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 mx-auto"
                          />
                        </div>
                        <p className="text-gray-700 text-sm mt-1">
                          {item.name}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
