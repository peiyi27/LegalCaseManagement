import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios if not already installed
import './ProfileSettingAdmin.css';
import { useNavigate } from 'react-router-dom';

const ProfileSettingAdmin = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Assuming your server is running at http://localhost:3001

    // Fetch admin email
    axios.get('http://localhost:3001/profile-get-admin-email')
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
    axios.get('http://localhost:3001/profile-get-admin-name')
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
    navigate('/UpdateEmailAdmin');
  };

  const handleNameButtonClick = () => {
    // Add the logic you want to perform when the name button is clicked
    navigate('/UpdateNameAdmin');
  };

  const handleBackClick = () => {
    navigate(`/Home`);
  };

  return (
    <div className="admin-profile-setting">
  {loading && <p className="loading">Loading...</p>}
  {!loading && error && <p className="error">Error: {error}</p>}
  {!loading && !error && (
    <div className="admin-details">
      <button onClick={handleBackClick} className="back-button">&#8592; Back</button>
      <div className="profile-section">
        <div className="profile-item">
          <h2>Admin's Name</h2>
          <p>{adminName}</p>
          <button onClick={handleNameButtonClick} className="update-button">Edit Name</button>
        </div>
        <div className="profile-item">
          <h2>Admin's Email</h2>
          <p>{adminEmail}</p>
          <button onClick={handleEmailButtonClick} className="update-button">Edit Email</button>
        </div>
      </div>
    </div>
  )}
</div>

);

  
};

export default ProfileSettingAdmin;
