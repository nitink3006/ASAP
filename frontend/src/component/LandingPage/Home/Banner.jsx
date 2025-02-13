import React from "react";
import Clean from "../../../assets/Clean.jpeg";
import AC from "../../../assets/AC.jpeg";
import Bed from "../../../assets/bed.jpeg";
import Spa from "../../../assets/spa.jpeg";

const Banner = () => {
  return (
    <div className="relative bg-white flex flex-col md:flex-row items-center justify-between px-6 lg:px-24 py-20 mt-10 font-[Inter]">
      {/* Text Section */}
      <div className="md:w-1/2 z-10 mb-60">
      <h1 className="text-5xl font-bold text-black leading-tight">
          All-in-One Solution, <span className="text-gray-600">Expert Services</span> at Your Doorstep
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-lg leading-relaxed">
          Managing household tasks has never been easier. From <strong>home cleaning</strong> and <strong>deep appliance servicing </strong> 
          to <strong>personal wellness</strong> and <strong>expert repairs</strong>, we bring certified professionals to your doorstep.  
          Experience the convenience of high-quality, hassle-free services—all tailored to meet your needs, delivered at your preferred time.
        </p>
      </div>

      {/* Pinterest-Style Masonry Grid */}
      <div className="md:w-1/2 columns-2 gap-2 space-y-2 mt-10 md:mt-0">
        <img src={Clean} alt="Cleaning Service" className="w-full rounded-lg shadow-md" />
        <img src={AC} alt="AC Service" className="w-full rounded-lg shadow-md" />
        <img src={Bed} alt="Bed Cleaning Service" className="w-full h-80 object-cover rounded-lg shadow-md" />
        <img src={Spa} alt="Spa Service" className="w-full rounded-lg shadow-md" />
      </div>

      {/* Background Design Elements */}
      <div className="absolute top-10 left-0 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
      <div className="absolute bottom-10 right-0 w-40 h-40 bg-gray-100 rounded-full opacity-50 blur-2xl"></div>
    </div>
  );
};

export default Banner;
