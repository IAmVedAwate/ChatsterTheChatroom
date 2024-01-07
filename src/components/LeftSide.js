import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LeftSide({ friends, setUserTo }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  // const navigate = useNavigate();

  const updateOnlineState = async (userName, onlineState) => {
    try {
      await axios.post(`http://localhost:5000/update-online-state/${userName}`, { onlineState });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  const fetchOnlineState = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stateinfo');
      console.log(response.data);
      const online = response.data.filter((user) => user.onlineState === 1).map((user) => user.username);
      const typing = response.data.filter((user) => user.typingState === 1).map((user) => user.username);
      setOnlineUsers(online);
      setTypingUsers(typing);
    } catch (error) {
      console.error('Error fetching online state:', error);
    }
  };

  const simulateTyping = (userName) => {
    setTypingUsers((prevTypingUsers) => {
      const typing = prevTypingUsers.includes(userName)
        ? prevTypingUsers.filter((user) => user !== userName)
        : [...prevTypingUsers, userName];
  
      setTimeout(() => {
        fetchOnlineState(); // Fetch updated online state after 1.5 seconds
      }, 1500);
  
      return typing;
    });
  };
  

  const handleFriendClick = (name) => {
    setUserTo(name);
  };

  useEffect(() => {
    // Fetch user's name using the stored email
    const fetchUserName = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await axios.get(`http://localhost:5000/user?email=${email}`);
        const userName = response.data[0].name;
        updateOnlineState(userName, true);
        simulateTyping(userName);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserName();
    const interval = setInterval(fetchOnlineState, 1500); // Fetch online state every 1.5 seconds
    return () => clearInterval(interval); // Cleanup interval

  }, []);

  return (
    <div className="col-md-4 bg-light p-3 left-div">
        <div className='row'>
        <div className='col-md-6'>
      <h2>Friends</h2>
      </div>
        <div className='col-md-6'>
        <p>Green -- ONLINE</p>
        <p>Yellow -- Typing</p>
        </div>
        </div>
      <div className="bg-light p-3 left-div2 left-div-scroll">
        <ul className="list-group left-div2">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="list-group-item"
              onClick={() => handleFriendClick(friend.name)}
              style={{
                border: onlineUsers.includes(friend.name) ? '2px solid green' : 'white',
                backgroundColor: typingUsers.includes(friend.name) ? 'yellow' : 'white',
              }}
            >
              {friend.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
