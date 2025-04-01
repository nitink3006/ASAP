import {
  FaUser,
  FaCreditCard,
  FaShieldAlt,
  FaQuestionCircle,
  FaArrowLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdOutlineSecurity, MdCardMembership } from "react-icons/md";
import { useLocation, Link, useNavigate } from "react-router-dom";


const helpTopics = [
  { title: "Account", icon: <FaUser className="text-black" /> },
  {
    title: "Getting started with ASAP",
    icon: <FaQuestionCircle className="text-black" />,
  },
  {
    title: "Payment & ASAP Credits",
    icon: <FaCreditCard className="text-black" />,
  },
  {
    title: "ASAP Plus Membership",
    icon: <MdCardMembership className="text-black" />,
  },
  { title: "ASAP Safety", icon: <MdOutlineSecurity className="text-black" /> },
  { title: "Warranty", icon: <FaShieldAlt className="text-black" /> },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
        <Link to="/">
          <button className="flex items-center text-black mb-4 cursor-pointer">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          How can we help you?
        </h1>
        <div className="space-y-4">
          {helpTopics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-xl text-black mr-4">{topic.icon}</div>
                <span className="text-lg font-medium text-gray-900">
                  {topic.title}
                </span>
              </div>
              <FaChevronRight className="text-black" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
