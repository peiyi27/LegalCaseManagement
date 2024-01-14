import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UpdateEmailStaff.css'; // Import your CSS file

const UpdateEmailStaff = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/profile-get-admin-email')
      .then((response) => {
        const { success, adminEmail, message } = response.data;

        if (success) {
          setAdminEmail(adminEmail);
        } else {
          setError(message);
        }
      })
      .catch((error) => {
        console.error(error);
        setError('Internal Server Error');
      });
  }, []);

  const handleSaveButtonClick = () => {
    axios
      .post('http://localhost:3001/update-admin-email', { newEmail })
      .then((response) => {
        setError('Email Updated Successfully');
        showSweetAlert('success', 'Email Updated Successfully');
      })
      .catch((error) => {
        console.error(error);
        setError('Email Update Failed: ' + error.response.data.message);
        showSweetAlert('error', 'Email Update Failed', error.response.data.message);
      });
  };

  const handleBackClick = () => {
    // Navigate to Home
    navigate('/ProfileSettingStaff');
  };

  const showSweetAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#71879e',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/ProfileSettingStaff');
      }
    });
  };

  return (
    <div className="staff-update-email">
      <button onClick={handleBackClick}>Back</button>
      <h2>Change Email</h2>
      <label>Current Email:</label>
      <p>{adminEmail}</p>
  
      <label>New Email:</label>
      <input
        type="text"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
  
      <button onClick={handleSaveButtonClick}>Save</button>
  
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UpdateEmailStaff;
