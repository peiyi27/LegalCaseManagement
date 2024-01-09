import React, { useEffect, useState } from 'react';
import axios from 'axios'; // You may need to install axios if you haven't already
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function ProfileSettings() {
    const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  // useEffect(() => {
  //   // Replace 'YOUR_SERVER_URL' with the actual URL of your server
  //   axios.get('http://localhost:3001/profile-setting')
  //     .then((response) => {
  //       setUserData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching user data:', error);
  //     });
  // }, []);



  return (
    <div className="profile-setting">
      <div className="back-button-container" onClick={() => navigate('/home')}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-button-icon" />
        <span>Back to Home</span>
      </div>
      <h1>Profile Settings</h1>
      <div className="profile-info">
      <div>
        <strong>Email:</strong> {userData.email}
      </div>
      <div>
        <strong>Role:</strong> {userData.role}
      </div>
    </div>
         
      </div>
  );
};

export default ProfileSettings;
