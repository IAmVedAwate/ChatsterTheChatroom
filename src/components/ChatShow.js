import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import '../css/ChatShow.css';
import LeftSide from './LeftSide';
import RightSide from './RightSide';

function ChatShow() {
  const [userTo, setUserTo] = useState('');
  const [userName, setUserName] = useState('');

  const updateOnlineState = async (userName, onlineState) => {
    try {
      await axios.post(`http://localhost:5000/update-online-state/${userName}`, { onlineState });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  const updateTypingState = async (userName, typingState) => {
    try {
      await axios.post(`http://localhost:5000/update-typing-state/${userName}`, { typingState });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  


  useEffect(() => {
    // Fetch user's name using the stored email
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



  const navigate = useNavigate();

  const handleLogout = () => {
    updateOnlineState(userName,false);
    updateTypingState(userName,false);
    localStorage.removeItem('email');
    localStorage.setItem('loggedIn', 'false');
    navigate("/login");
  };

  const friends = [
    { id: 2, name: 'ted' },
    { id: 3, name: 'robin' },
    { id: 4, name: 'lily' },
    { id: 5, name: 'marshall' },
  ];

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h1>Chatster - {userName}</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <div className="row">
        <LeftSide friends={friends} setUserTo={setUserTo} />
        <RightSide userTo={userTo} />
      </div>
    </div>
  );
}

export default ChatShow;
