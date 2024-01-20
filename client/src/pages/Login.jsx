import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import './Login.css'; // Make sure this path is correct
import legalLoginImage from './legal1.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();
  
  axios.defaults.withCredentials = true;

  const handleForgotPasswordClick = () => {
    navigate('/ForgetPassword'); // Use a relative path, not a full URL
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001', { email, password });

      if (response.status === 200) {
        switch (role) {
          case 'admin':
            navigate('/Home');
            break;
          case 'staff':
            navigate('/HomeForStaff');
            break;
          case 'user':
            navigate('/HomeForClient');
            break;
          default:
            // Handle unknown role
            navigate('/Home');
        }
      }
    } catch (err) {
      setError('Login failed: Invalid details. If you do not have an account, please sign up!');
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>Welcome to Apex Legal Solution</h1>
        <p>Your best legal advice</p>
        <img src={legalLoginImage} alt="Legal Image" />
      </div>
      <div className="right-panel">
        <form onSubmit={handleSubmit}>
          <h2>Sign in to your account to continue...</h2>
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
              <option value="staff">Staff</option>
              <option value="user">Client</option>
            </select>
          </div>
          <div className="text-small mb-20">
            <Link to="/ForgetPassword" onClick={handleForgotPasswordClick}>
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className="text-small">Sign In</button>
          <div className="text-center">
            <p className="text-small">Don’t have an account? <Link to="/SignUp">Create Account</Link></p>
          </div>
          {error && <p className="text-small text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
