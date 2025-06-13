import React, { useState } from 'react';
import Navbar from './LandingPage/Home/Navbar';
import Footer from './LandingPage/Home/Footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from '../Config';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_no: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${Config.API_URL}/contact-us/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', mobile_no: '', message: '' });
      } else {
        toast.error('Failed to send message. Try again later.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row p-10 px-6 lg:px-24 font-sans mt-32">
        <div className="flex-1 md:mr-10">
          <h1 className="text-2xl font-bold mb-5">Contact us</h1>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 mb-5 rounded border border-gray-300" placeholder="Enter full name" />

            <label className="block mb-2">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 mb-5 rounded border border-gray-300" placeholder="Enter your email address" />

            <label className="block mb-2">Enter mobile Number</label>
            <div className="flex mb-5">
              <select className="p-2 border border-gray-300 rounded-l">
                <option value="+1">+1</option>
              </select>
              <input type="tel" name="mobile_no" value={formData.mobile_no} onChange={handleChange} required className="w-full p-2 border border-gray-300 border-l-0 rounded-r" placeholder="mobile_no Number" />
            </div>

            <label className="block mb-2">Enter Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full p-2 mb-5 rounded border border-gray-300" placeholder="Enter message"></textarea>

            <button type="submit" className="bg-purple-700 text-white py-3 px-5 rounded cursor-pointer hover:bg-purple-800">Submit</button>
          </form>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 flex flex-col gap-5 mt-10 md:mt-0">
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">Need help?</h3>
            <p className="mb-3">For any immediate help regarding your bookings, please log-in and visit our Help Center. You will be able to get instant resolution through our chat support.</p>
            <Link to="/help-center" className="text-purple-700 hover:underline">Open Help Center →</Link>
          </div>

          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">Still facing issues?</h3>
            <p>If you've already tried chatting with us and are not satisfied with the resolution - please send us an email on <span className="font-medium">resolve@company.com</span>. We will get back to you within 24-48 hours.</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">Media inquiries</h3>
            <p>For media inquiries, you can send us an email on <span className="font-medium">press@company.com</span>.</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">What is our helpline number?</h3>
            <p>We have switched from a customer care mobile_no number to a fast, simple-to-use chat-based support. Just open our Help Center, select your issue, and initiate a chat with us.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
