import React, { useState } from "react";
import "./App.css";
// import "./script.jsx"
function App() {
  // State for toggling chatbot
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Function to toggle chatbot
  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  // Function to handle sending a message
  const sendMessage = () => {
    // Logic to send the message
  };

  return (
    <>
      <h1>Hi</h1>
      <button className="chatbot-toggler" onClick={toggleChatbot}>
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className="chatbot">
        <header>
          <h2>Chatbot</h2>
          <span
            className="close-btn material-symbols-outlined"
            onClick={toggleChatbot}
          >
            close
          </span>
        </header>
        <ul className="chatbox">
          <li className="chat incoming">
            <span className="material-symbols-outlined">smart_toy</span>
            <p>
              Hi there 👋
              <br />
              How can I help you today?
            </p>
          </li>
        </ul>
        <div className="chat-input">
          <textarea
            placeholder="Enter a message..."
            spellCheck="false"
            required
          ></textarea>
          <span
            id="send-btn"
            className="material-symbols-rounded"
            onClick={sendMessage}
          >
            send
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
