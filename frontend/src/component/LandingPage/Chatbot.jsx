import { useState, useEffect } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import axios from "axios";
import Config from "../../Config";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [animate, setAnimate] = useState("animate-bounce");

  const userData = JSON.parse(localStorage.getItem("user"));
  console.log("User Data:", userData);
  const user = userData?.user?.[0]; 
  const userId = user?.phone || null;

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const bounceTimer = setTimeout(() => setAnimate(""), 3000);
    return () => clearTimeout(bounceTimer);
  }, []);

  useEffect(() => {
    if (!user) {
      setMessages([{ text: "Please login to continue with ASAP Assistant.", sender: "bot" }]);
    }
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${Config.API_URL}/ai-assistant/`, {
        user_id: userId,
        query: input,
      });

     const botReply = response.data?.reply || "Sorry, no response from the assistant.";
      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("API error:", error);
      setMessages([...newMessages, { text: "Something went wrong. Please try again later.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className={`bg-gray-700 text-white cursor-pointer p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 ${animate}`}
          >
            <FiMessageCircle size={28} />
          </button>
          {showGreeting && (
            <div className="absolute bottom-full mb-2 right-0 bg-white shadow-lg text-gray-700 p-2 rounded-xl border border-gray-300 w-48 text-center">
              <span>How can I help you?</span>
              <button onClick={() => setShowGreeting(false)} className="ml-2 text-gray-500 hover:text-gray-700">
                <FiX size={16} />
              </button>
            </div>
          )}
        </div>
      )}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[450px] bg-white shadow-2xl rounded-2xl flex flex-col p-4 border border-gray-200">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">ASAP Assistant</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-600 cursor-pointer hover:text-gray-900">
              <FiX size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 max-w-[80%] rounded-xl shadow-md ${
                  msg.sender === "user" ? "bg-gray-500 text-white self-end ml-auto" : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">Thinking...</div>}
          </div>
          <div className="flex items-center gap-2 mt-auto border-t pt-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading || !user}
            />
            <button
              onClick={handleSend}
              className="bg-gray-700 cursor-pointer text-white p-3 rounded-xl hover:scale-105 transition-transform"
              disabled={loading || !user}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
