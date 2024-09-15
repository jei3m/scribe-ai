import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Chat.css";

const Chat = ({ selectedText, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTextSent, setSelectedTextSent] = useState(false); // Track if selectedText has been sent
  const [geminiHasChatted, setGeminiHasChatted] = useState(false);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();
  const location = useLocation();
  // const selectedText = location.state?.selectedText || '';

  // Utility function to sanitize and format the text
  const sanitizeText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*/g, '<br />')
      .replace(/^#\s(.*)$/gm, '<h1>$1</h1>')
      .replace(/^##\s(.*)$/gm, '<h2>$1</h2>')
      .replace(/^###\s(.*)$/gm, '<h3>$1</h3>');
  };

  useEffect(() => {
    const startChat = async () => {
      if (messages.length === 0) {
        try {
          const genAI = new GoogleGenerativeAI(API_KEY);
          const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are ScribeAI, a conversational document editor AI. Be concise.`,
          });
          const prompt = "Hello!";
          const result = await model.generateContent(prompt);
          const response = result.response;
          const text = await response.text();

          setMessages([
            {
              text: sanitizeText(text),
              user: false,
            },
          ]);
          setGeminiHasChatted(true);
        } catch (error) {
          toast.error("Error starting chat.");
        }
      }
    };

    startChat();
  }, [API_KEY, messages.length]);

  useEffect(() => {
    if (selectedText && !selectedTextSent && geminiHasChatted) {
      const timer = setTimeout(() => {
        sendMessage(`Please analyze: ${selectedText}`);
        setSelectedTextSent(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedText, selectedTextSent, geminiHasChatted]);

  const sendMessage = async (text = userInput) => {
    if (!text.trim()) {
      toast.warning("Please type a message before sending.");
      return;
    }

    setLoading(true);
    const userMessage = { text, user: true };

    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Gemini 1.5 Pro Experimental gemini-1.5-pro-exp-0827

    // Not the greetings but now the personality of the AI after greeting

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-exp-0827",
        systemInstruction: `You are ScribeAI, a conversational document editor AI. Help on producing ideas in writing. Answer even with very little context.`,
      });
      const prompt = userMessage.text;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = await response.text();

      setMessages(prevMessages => [
        ...prevMessages,
        { text: sanitizeText(responseText), user: false },
      ]);
    } catch (error) {
      toast.error("Error sending message.");
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <ToastContainer />
      <div className="header-chat">
        <h2 className="chat-title">ScribeAI</h2>
        <button 
          className="close-button" 
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message-container ${msg.user ? 'user' : 'ai'}`}>
            <div className={`message ${msg.user ? 'user' : 'ai'}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          className="message-input"
          placeholder="Type a message"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="search-button"
          onClick={() => sendMessage()}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <FontAwesomeIcon icon={faSearch} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;
