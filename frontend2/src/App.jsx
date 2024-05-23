import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [queryText, setQueryText] = useState("");
  const [response, setResponse] = useState("");
  const [chatbotOpen, setChatbotOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello, Please choose any one",
      // buttons: ["Option ", "Option 2", "Option 3"],
    },
    {
      sender: "bot",
      // text: "",
      buttons: ["Soil report ", "suggestions", "Soil health card", "Questions"],
    },
  ]);
  const chatboxRef = useRef(null);
  const inputRef = useRef(null);

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
        "https://dialogflow-dev.krishitantra.com/backend/dialogflow",
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
    inputRef.current.focus();
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);
  const handleButtonClick = async (option) => {
    const userMessage = { sender: "user", text: option };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const requestBody = {
      queryText: option,
      sessionId: "abcd123",
      languageCode: "en",
    };
    try {
      const response = await fetch(
        // "http://localhost:5000/dialogflow",
        "https://dialogflow-dev.krishitantra.com/backend/dialogflow",
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
    inputRef.current.focus();
  };

  return (
    <>
      {chatbotOpen && (
        <div className="spcl chatbot ">
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
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "48px" }}
                  >
                    {message.sender === "user" ? "face" : "smart_toy"}
                  </span>
                  {/* above is just the icon */}
                  {message.text && <p>{message.text}</p>}
                  {message.buttons && (
                    <div className="button-group">
                      <br />
                      {message.buttons.map((button, idx) => (
                        <div key={idx}>
                          <button
                            key={idx}
                            className="chat-button"
                            onClick={() => handleButtonClick(button)}
                          >
                            {button}
                          </button>
                          <br />
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* chat input is perfect dont touch it  */}
          <div className="chat-input">
            <form className="chat-input" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter your message...."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                ref={inputRef}
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
