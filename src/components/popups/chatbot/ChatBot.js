import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm VERO Bot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    const response = await fetch("https://clever-preferably-bird.ngrok-free.app/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_message: input,
        user_message_index: messages.filter(msg => msg.sender === "user").length + 1,
        model_message_index: messages.filter(msg => msg.sender === "bot").length + 1
      }),
    });

    const data = await response.json();

    const botMessage = {
      sender: "bot",
      text: data.response || "Sorry, I didn’t get that.",
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "There was an error. Please try again later." },
    ]);
    console.error(error);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

return (
  <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
    {!isOpen && (
      <div className="chatbot-toggle" onClick={() => setIsOpen(true)}>
        <FaRobot />
      </div>
    )}

    {isOpen && (
      <div className="chatbot-box">
        <div className="chatbot-header">
          <FaRobot className="chatbot-icon" />
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>
            <FaPaperPlane />
          </button>
        </div>

        <div className="chatbot-disclaimer">
          This is an AI, we are not responsible if it says anything<br />
          out of the ordinary from normal circumstances. Please <br />
          do not take this as professional advice.
        </div>
      </div>
    )}
  </div>
);
};

export default ChatBot;
