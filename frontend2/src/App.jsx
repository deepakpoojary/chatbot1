import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [queryText, setQueryText] = useState("");
  const [response, setResponse] = useState("");
  const [chatbotOpen, setChatbotOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const chatboxRef = useRef(null);

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
    console.log(chatbotOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { sender: "user", text: queryText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQueryText("");

    const requestBody = {
      queryText: queryText,
      sessionId: "abcd123",
      languageCode: "en",
    };

    try {
      const response = await fetch(
        "https://dialogflow-dev.krishitantra.com/dialogflow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not okkk");
      }

      const data = await response.text();
      const botMessage = { sender: "bot", text: data };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      const botMessage = {
        sender: "bot",
        text: "Oops! Something went wrong. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {chatbotOpen && (
        <div className="chatbot">
          <header>
            <h2>Krishi Bot</h2>
            <span
              className="close-btn material-symbols-outlined"
              onClick={toggleChatbot}
            >
              close
            </span>
          </header>
          <div className="chatbox" ref={chatboxRef}>
            <ul>
              {messages.map((message, index) => (
                <li key={index} className={`chat ${message.sender}`}>
                  <span className="material-symbols-outlined">
                    {message.sender === "user" ? "face" : "smart_toy"}
                  </span>
                  <p>{message.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-input">
            <form className="chat-input" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter your message...."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
              />
              <button
                id="send-btn"
                type="submit"
                className="material-symbols-rounded"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
