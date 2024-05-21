import React, { useState } from "react";
import "./App.css";
const App = () => {
  const [queryText, setQueryText] = useState("");
  const [response, setResponse] = useState("");
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);

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
      const response = await fetch("http://35.223.72.146/dialogflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
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

  return (
    <>
      <button className="chatbot-toggler" onClick={toggleChatbot}>
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      {chatbotOpen && (
        <div className="chatbot">
          <header>
            <h2>Krishi Bot</h2>
            <span className="close-btn material-symbols-outlined">close</span>
          </header>
          <div className="chatbox">
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

          {/* <div className="chatbox">
            <li className="chat incoming">
              <span className="material-symbols-outlined">smart_toy</span>
              {response && (
                <p>
                  Response:{" "}
                  {typeof response === "string"
                    ? response
                    : JSON.stringify(response, null, 2)}
                </p>
              )}
            </li>
          </div> */}
        </div>
      )}
    </>
  );
};

export default App;
