import React, { useState, useEffect } from "react";
import "./Message.css";
import ReactHtmlParser from "html-react-parser";
import ScrollToBottom from "react-scroll-to-bottom";
const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes()
      };
      // Check if the current message contains a link
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const hasUrl = currentMessage.match(urlRegex);
      // If the message contains a link, add an anchor tag around it
      if (hasUrl) {
        messageData.message = currentMessage.replace(
          urlRegex,
          '<a href="$&" target="_blank">$&</a>'
        );
      }

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.off("receive_message");
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);

      // Check if the current message contains a link
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const hasUrl = currentMessage.match(urlRegex);
      // If the message contains a link, add an anchor tag around it
      if (hasUrl) {
        data.message = currentMessage.replace(
          urlRegex,
          '<a href="$&" target="_blank">$&</a>'
        );
      }

    });
  }, [currentMessage, socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, i) => {
            return (
              <div
                key={i}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    {/* <p>{messageContent.message}</p> */}
                    <p> {ReactHtmlParser(messageContent.message)}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Text"
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
