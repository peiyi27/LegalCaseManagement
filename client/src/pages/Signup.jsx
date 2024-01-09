import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import './Signup.css'; // Create a new CSS file for your Register page
import legalRegisterLogo from './logo.png';
import legalRegisterImage from './RegisterImage.jpg';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/register', { email, password, role });
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      setError('Registration failed: User existed, please log in to the application.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-left-panel">
        <img src={legalRegisterLogo} alt="Legal Logo" className="logoRegister" />
        <h1>Get Started with your Account </h1>
        <img src={legalRegisterImage} alt="Legal Register Image" />
      </div>
      <div className="register-right-panel">
        <form onSubmit={handleSubmit} className='registerform'>
          <h2 className='register-form-title'>Create an account to get started...</h2>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit" className='RegisterButton'>Sign Up</button>
          <div className="register-text-center">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
          {error && <p className="register-text-small text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
