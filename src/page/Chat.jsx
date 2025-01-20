import React, { useState, useEffect, useRef } from "react";
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
  const [selectedTextSent, setSelectedTextSent] = useState(false);
  const [geminiHasChatted, setGeminiHasChatted] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();
  const location = useLocation();

  const sanitizeText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*/g, '<br/>')
      .replace(/^#\s(.*)$/gm, '<h1>$1</h1>')
      .replace(/^##\s(.*)$/gm, '<h2>$1</h2>')
      .replace(/^###\s(.*)$/gm, '<h3>$1</h3>');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const streamText = async (fullText, messageIndex) => {
    setIsStreaming(true);
    let currentText = "";
    const chars = fullText.split("");
    
    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i];
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          text: sanitizeText(currentText)
        };
        return updatedMessages;
      });
      
      // Adjust the delay for smoother or faster streaming
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    const startChat = async () => {
      if (messages.length === 0) {
        try {
          const genAI = new GoogleGenerativeAI(API_KEY);
          const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: `You are ScribeAI, a conversational document editor AI. Be concise.`,
          });
          const prompt = "Hello!";
          const result = await model.generateContent(prompt);
          const response = result.response;
          const text = await response.text();

          const promptTokens = prompt.split(/\s+/).length;
          const responseTokens = text.split(/\s+/).length;
          setTokenUsage(promptTokens + responseTokens);

          setMessages([{ text: "", user: false }]);
          streamText(text, 0);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text = userInput) => {
    if (!text.trim()) {
      toast.warning("Please type a message before sending.");
      return;
    }

    if (isStreaming) {
      return; // Prevent sending new messages while streaming
    }

    setLoading(true);
    const userMessage = { text, user: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-exp-0827",
        systemInstruction: `You are ScribeAI, a conversational document editor AI. Help on producing ideas in writing, be concise. Add some styles in your answers. Answer even with very little context.`,
      });
      const prompt = userMessage.text;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = await response.text();

      const promptTokens = prompt.split(/\s+/).length;
      const responseTokens = responseText.split(/\s+/).length;
      setTokenUsage(prevUsage => prevUsage + promptTokens + responseTokens);

      const newMessageIndex = messages.length + 1;
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "", user: false },
      ]);
      
      await streamText(responseText, newMessageIndex);
    } catch (error) {
      toast.error("Error sending message.");
    } finally {
      setLoading(false);
      setUserInput("");
    }
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
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          className="message-input"
          placeholder="Type a message"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          onKeyDown={(e) => e.key === "Enter" && !isStreaming && sendMessage()}
          disabled={isStreaming}
        />
        <button
          className="search-button"
          onClick={() => sendMessage()}
          disabled={loading || isStreaming}
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <FontAwesomeIcon icon={faSearch} />
          )}
        </button>
      </div>
      <div className="token-usage">
        Tokens used: {tokenUsage}
      </div>
    </div>
  );
};

export default Chat;