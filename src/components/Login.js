import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') || false);
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('email') || '');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      console.log(response.data); // Log the server response

      // Store email and logged-in status in localStorage upon successful login
      localStorage.setItem('email', formData.email);
      localStorage.setItem('loggedIn', true);
      setLoggedIn(true);
      setLoggedInUser(formData.email);

      // For the sake of this example, let's just log a success message
      console.log('Login successful!');
      navigate('/chatshow'); 
    } catch (error) {
      console.error('Error logging in:', error.response.data); // Log the error response
      // Handle login error - show error message, validation, etc.
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="border border-primary m-5 p-4 w-50 d-flex justify-content-center">
        {loggedIn===true ? (
            <>
          <p>{`Logged in as: ${loggedInUser}`}</p>
          <br />
          <a href="/chatshow" className="btn btn-secondary mx-3">Chats</a>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="w-50">
            <h2 className="mb-4 text-center">Login</h2>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
            <Link to="/" className="btn btn-secondary m-3">SignUp</Link>
          </form>
        )}
      </div>
    </div>
  );
}
