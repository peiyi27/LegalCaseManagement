import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UpdateEmailAdmin.css'; // Import your CSS file

const UpdateEmailAdmin = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleSaveButtonClick = () => {
    axios.post('http://localhost:3001/update-admin-email', { newEmail })
      .then(response => {
        setError('Email Updated Successfully');
        Swal.fire({
          title: 'Success!',
          text: 'Email Updated Successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/ProfileSettingAdmin');
        });
      })
      .catch(error => {
        console.error(error);
        setError('Email Update Failed: ' + error.response.data.message);
        Swal.fire({
          title: 'Error!',
          text: 'Email Update Failed: ' + error.response.data.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  const handleBackClick = () => {
    navigate('/ProfileSettingAdmin');
  };

  return (
    <div className="admin-update-email">
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

export default UpdateEmailAdmin;
