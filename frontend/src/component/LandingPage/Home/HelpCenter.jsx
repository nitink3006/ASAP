import { useState } from "react";
import {
    FaUser,
    FaCreditCard,
    FaShieldAlt,
    FaQuestionCircle,
    FaArrowLeft,
    FaChevronRight,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import { MdOutlineSecurity, MdCardMembership } from "react-icons/md";
import { useLocation, Link, useNavigate } from "react-router-dom";

const helpData = {
    Account: [
        {
            question: "How do I sign up on the platform?",
            answer: "Go to our homepage and click Sign Up. You can register using your mobile number with secure OTP verification via Firebase.",
        },
        {
            question: "Can I edit my personal information after registration?",
            answer: "Yes, just head over to your Profile Settings and make changes to your name, phone number, or address.",
        },
        {
            question: "What should I do if I can't log in?",
            answer: "Click on the Forgot Password option to reset your password. If you're still facing issues, please contact our support team.",
        },
        {
            question: "Is my data safe on this platform?",
            answer: "Absolutely. We use Firebase's OTP-based authentication and follow industry-standard encryption to protect your data.",
        },
        {
            question: "How do I reschedule or cancel a service?",
            answer: "You can reschedule or cancel your booking from the 'My Bookings' section at least 2 hours before the scheduled time.",
        },
    ],
    "Getting started with ASAP": [
        {
            question: "What is ASAP and what does it do?",
            answer: "ASAP is a smart, responsive service-booking platform designed for property owners who want reliable help for tasks like cleaning, packing, wellness, and more.",
        },
        {
            question: "How do I book a service?",
            answer: "Log in, choose your service category, select a provider based on time and availability, and confirm your booking.",
        },
        {
            question: "Can I see real-time status of my service request?",
            answer: "Yes, our platform provides live location tracking and real-time updates once the booking is confirmed.",
        },
        {
            question: "Are the service providers verified?",
            answer: "Yes. All professionals are background-verified and trained to deliver high-quality service.",
        },
    ],
    "Payment & ASAP Credits": [
        {
            question: "What payment methods do you accept?",
            answer: "We accept UPI, debit/credit cards, and mobile wallets. You can also use your ASAP credits earned from referrals or cashback.",
        },
        {
            question: "Can I pay after the service is complete?",
            answer: "Most services require pre-payment for confirmation, but we do offer post-service billing for certain categories.",
        },
        {
            question: "What if I cancel my service---do I get a refund?",
            answer: "Yes. If you cancel within the allowed time frame, your payment will be refunded based on our cancellation policy.",
        },
        {
            question: "How do I view my payment history?",
            answer: "Go to the Payment section in your profile to see all past transactions and billing details.",
        },
    ],
    "ASAP Plus Membership": [
        {
            question: "What is ASAP Plus?",
            answer: "ASAP Plus is a premium membership that gives you priority bookings, discounted rates, and free rescheduling on selected services.",
        },
        {
            question: "How do I become a member?",
            answer: "Go to your profile and click Join ASAP Plus. Choose a plan and complete the payment to start enjoying benefits.",
        },
        {
            question: "Can I cancel my membership?",
            answer: "Yes, you can cancel it anytime. You'll continue to receive benefits until your billing cycle ends.",
        },
        {
            question: "Is there a trial period?",
            answer: "Yes, new users can enjoy a 7-day free trial of ASAP Plus.",
        },
    ],
    "ASAP Safety": [
        {
            question: "How do you ensure the safety of customers?",
            answer: "We verify all service providers, offer live tracking, and enable emergency contact support directly through the app.",
        },
        {
            question: "What if I feel unsafe during a service?",
            answer: "You can use the 'Emergency Help' button available during an active booking to alert our support team immediately.",
        },
        {
            question: "Are your professionals trained?",
            answer: "Yes, we onboard only those who complete basic safety and service delivery training.",
        },
    ],
    Warranty: [
        {
            question: "What does your Service Guarantee cover?",
            answer: "We offer a satisfaction guarantee for all services. If something doesn't meet your expectations, we'll make it right---either by a revisit or a refund.",
        },
        {
            question: "What should I do if I'm unhappy with a service?",
            answer: "Please report your concern within 24 hours of the service completion. Our support team will initiate a resolution.",
        },
        {
            question: "Are all services covered under this guarantee?",
            answer: "Yes, every service listed on our platform---whether cleaning, packing, or wellness---is backed by our service assurance policy.",
        },
        {
            question: "Do I get charged for rework?",
            answer: "No, if the issue is reported in time and falls under the guarantee, the correction is free of charge.",
        },
    ],
};

const helpTopics = [
    { title: "Account", icon: <FaUser className="text-purple-600/80" /> },
    {
        title: "Getting started with ASAP",
        icon: <FaQuestionCircle className="text-purple-600/80" />,
    },
    {
        title: "Payment & ASAP Credits",
        icon: <FaCreditCard className="text-purple-600/80" />,
    },
    {
        title: "ASAP Plus Membership",
        icon: <MdCardMembership className="text-purple-600/80" />,
    },
    {
        title: "ASAP Safety",
        icon: <MdOutlineSecurity className="text-purple-600/80" />,
    },
    { title: "Warranty", icon: <FaShieldAlt className="text-purple-600/80" /> },
];

export default function HelpCenter() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const topic = searchParams.get("topic");
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const handleTopicClick = (selectedTopic) => {
        navigate(`?topic=${encodeURIComponent(selectedTopic)}`);
        setExpandedQuestion(null);
    };

    const handleBack = () => {
        navigate("?");
        setExpandedQuestion(null);
    };

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray500 flex items-center justify-center p-6">
            <div className="max-w-3xl w-full backdrop-blur-lg bg-white/80 border border-[#E0E0E0] shadow-xl rounded-2xl p-6">
                {!topic ? (
                    <>
                        <Link to="/">
                            <button className="flex items-center text-purple-600 hover:text-purple-400 mb-4 transition">
                                <FaArrowLeft className="mr-2" /> Back to Home
                            </button>
                        </Link>
                        <h1 className="text-4xl font-bold text--900 mb-6">
                            How can we help you?
                        </h1>
                        <div className="grid sm:grid-cols-1 gap-4">
                            {helpTopics.map((topic, index) => (
                                <div
                                    key={index}
                                    onClick={() =>
                                        handleTopicClick(topic.title)
                                    }
                                    className="flex items-center justify-between p-5 bg-white/70 backdrop-blur border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <div className="text-2xl mr-4">
                                            {topic.icon}
                                        </div>
                                        <span className="text-lg font-medium text-gray-800">
                                            {topic.title}
                                        </span>
                                    </div>
                                    <FaChevronRight className="text-gray-500" />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleBack}
                            className="flex items-center text-purple-600 hover:text-purple-400 mb-4 transition"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Help Topics
                        </button>
                        <h1 className="text-4xl font-bold text-black mb-6">
                            {topic}
                        </h1>
                        <div className="space-y-4">
                            {helpData[topic]?.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-xl shadow-sm bg-white/90 backdrop-blur transition-all"
                                >
                                    <div
                                        onClick={() => toggleQuestion(index)}
                                        className="flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800 pr-2">
                                            {faq.question}
                                        </h3>
                                        {expandedQuestion === index ? (
                                            <FaChevronUp className="text-purple-600" />
                                        ) : (
                                            <FaChevronDown className="text-gray-500" />
                                        )}
                                    </div>
                                    <div
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                            expandedQuestion === index
                                                ? "max-h-96 opacity-100"
                                                : "max-h-0 opacity-0"
                                        }`}
                                    >
                                        <div className="p-5 border-t border-gray-200 bg-white text-gray-600">
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
