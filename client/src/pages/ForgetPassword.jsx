import axios from "axios";
import React, { useState } from "react";
import './ForgetPassword.css';
import legalForgetLogo from './logo.png';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleCheckEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/check-email', { email });
      if (response.status === 200) {
        setEmailConfirmed(true);
        setResetPasswordError('');
      }
    } catch (err) {
      setResetPasswordError('Email not found in our records.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3001/reset-password', { email, newPassword });
      if (response.status === 200) {
        setResetPasswordSuccess(true);
        setResetPasswordError('');
        
        // Redirect to the login page
        navigate('');
      }
    } catch (err) {
      setResetPasswordError('Password reset failed.');
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="logo-container">
        <img src={legalForgetLogo} alt="Legal Logo" className="forgetpasswordlogo" />
      </div>
      <div className="content-container">
        <h2 className="center-text">Enter your email address associated with your account to reset your password</h2>
        <div className="forgot-password-container">
          {!emailConfirmed ? (
            <form className="form-container" onSubmit={handleCheckEmail}>
              <div>
                <label className="forget-form-label">Enter your email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-email"
                />
              </div>
              {resetPasswordError && <p className="text-danger">{resetPasswordError}</p>}
              <button type="submit" className="forget-button-submit">Submit </button>
            </form>
          ) : resetPasswordSuccess ? (
            <p>Password reset successfully! Check your email for further instructions.</p>
          ) : (
            <form className="form-container" onSubmit={handleResetPassword}>
              <div>
                <label className="forget-form-label">Enter your new password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="input-email"
                />
              </div>
              {resetPasswordError && <p className="text-danger">{resetPasswordError}</p>}
              <button type="submit" className="forget-button-submit">Reset Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
