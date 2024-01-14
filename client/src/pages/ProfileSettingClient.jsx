import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios if not already installed
import './ProfileSettingClient.css';
import { useNavigate } from 'react-router-dom';

const ProfileSettingClient = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Assuming your server is running at http://localhost:3001

    // Fetch admin email
    axios.get('http://localhost:3001/profile-get-client-email')
      .then(response => {
        const { success, adminEmail, message } = response.data;

        if (success) {
          setAdminEmail(adminEmail);
        } else {
          setError(message);
        }
      })
      .catch(error => {
        console.error(error);
        setError('Internal Server Error');
      });

    // Fetch admin name
    axios.get('http://localhost:3001/profile-get-client-name')
      .then(response => {
        const { success, adminName, message } = response.data;

        if (success) {
          setAdminName(adminName);
        } else {
          setError(message);
        }
      })
      .catch(error => {
        console.error(error);
        setError('Internal Server Error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array to run the effect only once when the component mounts

  const handleEmailButtonClick = () => {
    // Add the logic you want to perform when the email button is clicked
    navigate('/UpdateEmailClient');
  };

  const handleNameButtonClick = () => {
    // Add the logic you want to perform when the name button is clicked
    navigate('/UpdateNameClient');
  };

  const handleBackClick = () => {
    navigate(`/HomeForClient`);
  };

  return (
    <div className="client-profile-setting">
    {loading && <p className="loading">Loading...</p>}
    {!loading && error && <p className="error">Error: {error}</p>}
    {!loading && !error && (
      <div className="client-details">
        <button onClick={handleBackClick} className="back-button">&#8592; Back</button>
        <div className="profile-section">
          <div className="profile-item">
            <h2>Client's Name</h2>
            <p>{adminName}</p>
            <button onClick={handleNameButtonClick} className="update-button">Edit Name</button>
          </div>
          <div className="profile-item">
            <h2>Client's Email</h2>
            <p>{adminEmail}</p>
            <button onClick={handleEmailButtonClick} className="update-button">Edit Email</button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default ProfileSettingClient;
