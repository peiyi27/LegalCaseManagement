import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UpdateNameAdmin.css';

const UpdateNameAdmin = () => {
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/profile-get-admin-name')
      .then((response) => {
        const { success, adminName, message } = response.data;

        if (success) {
          setAdminName(adminName);
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
      .post('http://localhost:3001/update-admin-name', { newName })
      .then((response) => {
        setError('Name Updated Successfully');
        showSweetAlert('success', 'Name Updated Successfully');
      })
      .catch((error) => {
        console.error(error);
        setError('Name Update Failed: ' + error.response.data.message);
        showSweetAlert('error', 'Name Update Failed', error.response.data.message);
      });
  };

  const handleBackClick = () => {
    // Navigate to Home
    navigate('/ProfileSettingAdmin');
  };

  const showSweetAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#71879e',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/ProfileSettingAdmin');
      }
    });
  };

  
  return (
    <div className="admin-update-name">
      <button onClick={handleBackClick}>Back</button>
      <h2>Change Name</h2>
      <label>Current Name:</label>
      <p>{adminName}</p>
  
      <label>New Name:</label>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
  
      <button onClick={handleSaveButtonClick}>Save</button>
  
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UpdateNameAdmin;
