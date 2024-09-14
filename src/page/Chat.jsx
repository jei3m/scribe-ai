import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTextSent, setSelectedTextSent] = useState(false); // Track if selectedText has been sent

  const API_KEY = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();
  const location = useLocation();
  const selectedText = location.state?.selectedText || '';

  // Utility function to sanitize and format the text
  const sanitizeText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*/g, '<br />');
  };

  useEffect(() => {
    const startChat = async () => {
      if (messages.length === 0) {
        try {
          const genAI = new GoogleGenerativeAI(API_KEY);
          const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-exp-0827",
            systemInstruction: `You are ScribeAI, a conversational document editor AI. Be concise.`,
          });
          const prompt = "Introduce yourself concisely";
          const result = await model.generateContent(prompt);
          const response = result.response;
          const text = await response.text();

          setMessages([
            {
              text: sanitizeText(text),
              user: false,
            },
          ]);
        } catch (error) {
          toast.error("Error starting chat.");
        }
      }
    };

    startChat();
  }, [API_KEY, messages.length]);

  useEffect(() => {
    if (messages.length > 0 && selectedText && !selectedTextSent) {
      setUserInput(`Please correct the grammar and give me suggestions: ${selectedText}`);
      sendMessage(`Please correct the grammar and give me suggestions: ${selectedText}`);
      setSelectedTextSent(true); // Ensure selectedText is only sent once
    }
  }, [messages, selectedText, selectedTextSent]);

  const sendMessage = async (text = userInput) => {
    if (!text.trim()) {
      toast.warning("Please type a message before sending.");
      return;
    }

    setLoading(true);
    const userMessage = { text, user: true };

    setMessages(prevMessages => [...prevMessages, userMessage]);

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

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="chat-container">
      <ToastContainer />
      <div className="header-chat">
        <h2>Inscribe AI</h2>
        <button className="back-button" onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
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