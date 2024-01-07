// RightSide.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RightSide({ userTo }) {
  const [chatContent, setChatContent] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [userName, setUserName] = useState('');

  const updateOnlineState = async (userName, onlineState) => {
    try {
      await axios.post(`http://localhost:5000/update-online-state/${userName}`, { onlineState });

    } catch (error) {
      // Handle error
    }
  };
  
  const updateTypingState = async (userName, typingState) => {
    try {
      await axios.post(`http://localhost:5000/update-typing-state/${userName}`, { typingState });
        
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await axios.get(`http://localhost:5000/user?email=${email}`);
        setUserName(response.data[0].name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserName();
  }, []);

  const apiDataFetcher = async (userTo,userName) => {
    if (userTo) {

        const response = await axios.get(`http://localhost:5000/api/v1/chat_history?user_from=${userName}&user_to=${userTo}`);
        // Check if the response data is an array before setting state
        if (Array.isArray(response.data)) {
          setChatContent(response.data); // Assuming the API response is an array of chat messages
        } else {
          console.error('Invalid chat history data format:', response.data);
        }
      }
  }

  const handleSendMessage = async () => {
    try {
      const fromUser = userName;
      if (fromUser && userTo && chatInput) {
        const response = await axios.post('http://localhost:5000/chat_history', {
          from_user: fromUser,
          to_user: userTo,
          chat_text: chatInput,
        });
        
        console.log(response.data); // Handle success response
        apiDataFetcher(userTo,userName);
        setChatInput(''); // Clear input after sending message
        updateTypingState(userName,false);
      } else {
        console.error('Invalid data');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  
  
  const changeHandler = (e) => {
    setChatInput(e.target.value);
    updateOnlineState(userName, true);
    updateTypingState(userName,true);
    if (e.target.value === ""){
        updateTypingState(userName,false);
    }
}

  useEffect(() => {
    const fetchData = async () => {
      try {
        apiDataFetcher(userTo,userName);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchData();
  }, [userTo]);


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission behavior
      handleSendMessage();
    }
  };

  return (
    <div className="col-md-8 container bg-light right-div alignments">
      <h2>Chat</h2>
      <div className="bg-light row">
        <div className="chat-body left-div-scroll row" id="chatBody">
          {Array.isArray(chatContent) && chatContent.map(chat => (
            <div key={chat.id} className={`mb-4 message ${chat.from_user === userName ? 'user' : 'bot'}`}>  
              {chat.chat_text}
            </div>
          ))}
        </div>
        <div className='alignments'>
        <input type="text" className="chat-input" placeholder="Type a message" value={chatInput} onChange={changeHandler}
          autoComplete="off" onKeyDown={handleKeyPress} autoFocus
        />
        <button type="button" className="send-button" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
