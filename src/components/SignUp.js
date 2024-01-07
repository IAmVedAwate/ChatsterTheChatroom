import React, { useState } from 'react';
import axios from 'axios';
import '../css/ChatShow.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      console.log(response.data); // Log the server response
        navigate("/login");
      // Handle successful signup - show success message, redirect, etc.
    } catch (error) {
      console.error('Error signing up:', error.response.data); // Log the error response
      // Handle signup error - show error message, validation, etc.
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="sized border border-dark p-4 my-5">
      <h2 className="mt-4 mb-3">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary mx-3">Sign Up</button>
        <Link to="/login" className="btn btn-secondary ">Login</Link>
      </form>
      </div>
    </div>
  );
}
