import React from "react";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
    return (
        <>
            <div className="border-t border-gray-400"></div>

            <footer className="bg-gray-50 text-black py-10 px-6 lg:px-24">
                {/* Top Border Line */}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    {/* Company Info */}
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold">ASAP</h2>
                        <p className="mt-2 text-sm text-black">
                            Your trusted partner for home services, wellness,
                            and more.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="mt-2 space-y-1 text-black">
                            <li>
                                <a href="#" className="hover:text-gray-500">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="hover:text-gray-500"
                                >
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/help-center"
                                    className="hover:text-gray-500"
                                >
                                    Help Center
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Socials */}
                    <div>
                        <h3 className="text-lg font-semibold">Get in Touch</h3>
                        <p className="mt-2 text-black text-sm">
                            123 Main Street, City, Country
                        </p>
                        <p className="text-black text-sm">
                            Email: support@expertservices.com
                        </p>
                        <p className="text-black text-sm">
                            Phone: +123 456 7890
                        </p>

                        <div className="flex space-x-4 mt-4">
                            <a
                                href="#"
                                className="text-black hover:text-gray-500"
                            >
                                <FaFacebookF />
                            </a>
                            <a
                                href="#"
                                className="text-black hover:text-gray-500"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href="#"
                                className="text-black hover:text-gray-500"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="#"
                                className="text-black hover:text-gray-500"
                            >
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Expert Services. All Rights
                    Reserved.
                </div>
            </footer>
        </>
    );
};

export default Footer;
