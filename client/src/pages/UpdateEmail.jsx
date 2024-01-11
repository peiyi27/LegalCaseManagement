import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './UpdateEmail.css';

const UpdateEmail = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(true);
      })
      .catch(error => {
        console.error(error);
        setError('Email Update Failed: ' + error.response.data.message);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/Home');
  };

  return (
    <div className="UpdateEmailContainer"> {/* Add the class name here */}
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Email Update Modal"
      >
        <p>{error}</p>
        <button onClick={closeModal}>OK</button>
      </Modal>
    </div>
  );
};

export default UpdateEmail;
