import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Message.css";

const socket = io("http://localhost:5000");
const Message = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const me = "hello there";
  // Listen for incoming chat messages
  useEffect(() => {
    socket.on("connection", (msg) => {
      console.log(`Received message: ${msg}`);
      setMessages((prevMessages) => [...prevMessages]);
    });
  }, []);
  socket.on("message", (data) => {
    document.querySelector(me).innerHTML = data;
    console.log(`Received message: ${data}`);
  });
  // Send a new chat message to the server
  const handleSendMessage = () => {
    if (messageInput !== "") {
      socket.emit("message", messageInput);
      socket.on("message", "");
      setMessageInput("");
    }
  };

  return (
    <div>
      <div className="message-list">
        <h1>hello</h1>
        {messages.map((msg) => (
          <div key={msg.timestamp} className="message">
            <div className="message-sender">{msg.sender}</div>
            <div className="message-content">{msg.message}</div>
            <div className="message-timestamp">
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          className="message-input-field"
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button className="message-send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Message;
