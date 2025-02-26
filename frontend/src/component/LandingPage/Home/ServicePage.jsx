import React from "react";
import { FaStar } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";

const services = [
  {
    title: "Kitchen/Bathroom",
    image: "https://via.placeholder.com/100",
    options: [
      {
        name: "Test control (includes utensil removal)",
        rating: 4.79,
        reviews: "98K",
        price: "Starts at ₹1,498",
        description: "We'll remove utensils before the service begins",
        details: "6 options",
      },
      {
        name: "Test control (excludes utensil removal)",
        rating: 4.80,
        reviews: "63K",
        price: "Starts at ₹1,299",
        description: "Treatment will be completed in 2 visits with 2 weeks. Excludes removal of utensils & objects before the service begins",
        details: "6 options",
      },
    ],
  },
  {
    title: "Apartment/Bungalow",
    image: "https://via.placeholder.com/100",
    options: [
      {
        name: "Apartment pest control (includes utensil removal)",
        rating: 4.81,
        reviews: "25K",
        price: "Starts at ₹1,498",
        description: "Spray treatment followed by gel treatment after 2 weeks. We'll remove utensils before the service begins",
        details: "5 options",
      },
      {
        name: "Apartment pest control (excludes utensil removal)",
        rating: 4.81,
        reviews: "132K",
        price: "Starts at ₹1,299",
        description: "Spray treatment followed by gel treatment after 2 weeks. Excludes removal of utensils & objects before the service begins",
        details: "5 options",
      },
    ],
  },
  {
    title: "Offices/Shops",
    image: "https://via.placeholder.com/100",
    options: [
      {
        name: "Office pest control",
        rating: 4.64,
        reviews: "4K",
        price: "Starts at ₹1,649",
        description: "Comprehensive pest control for office spaces",
        details: "4 options",
      },
      {
        name: "Retail shop pest control",
        rating: 4.63,
        reviews: "789",
        price: "Starts at ₹1,649",
        description: "Pest control solutions tailored for retail shops",
        details: "4 options",
      },
    ],
  },
];

const ServicePage = () => {
  return (
    <>
      <Navbar />
      <div className="flex p-10 mt-24 min-h-screen mx-auto">
        {/* Left Sidebar */}
        <div className="w-2/7 border-r pr-4">
          <h1 className="text-3xl font-bold">Cockroach, Ant & General Pest Control</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <FaStar className="text-purple-600" />
            <span className="ml-1">4.84 (1.0 M bookings)</span>
          </div>

          {/* Service Selection */}
          <div className="mt-6 border p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Select a service</h2>
            <div className="flex justify-between mt-4">
              {services.map((service, index) => (
                <div key={index} className="text-center">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-24 h-24 rounded-lg shadow"
                  />
                  <p className="mt-2 text-sm">{service.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/7 px-6">
          {services.map((service, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
              {service.options.map((option, idx) => (
                <div key={idx} className="border p-4 rounded-lg shadow mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{option.name}</h3>
                    <div className="flex items-center">
                      <FaStar className="text-purple-600" />
                      <span className="ml-1">{option.rating} ({option.reviews} reviews)</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{option.price}</p>
                  <p className="text-gray-600 mt-2">{option.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">Add</button>
                    <span className="text-gray-600">{option.details}</span>
                    <button className="text-purple-600">View details</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Right Section */}
        <div className="w-2/7 pl-4">
          <div className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">No items in your cart</h2>
            <div className="bg-yellow-100 p-4 rounded-lg mb-4">
              <p className="text-yellow-800 font-semibold">Save 10% on every order</p>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg mt-2">Get Plus now</button>
            </div>
            <button className="text-purple-600 w-full text-left">View More Offers</button>
          </div>

          <div className="mt-6 border p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">ASAP Promise</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-600">✓</span>
                <span className="ml-2">Verified Professionals</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600">✓</span>
                <span className="ml-2">Hassle Free Booking</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600">✓</span>
                <span className="ml-2">Transparent Pricing</span>
              </div>
            </div>
          </div>
          </div>
      </div>
      <Footer />
    </>
  );
};

export default ServicePage;