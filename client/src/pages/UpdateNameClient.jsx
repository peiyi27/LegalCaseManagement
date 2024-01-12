import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './UpdateNameClient.css'; 


const UpdateNameClient = () => {
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
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
      });
  }, []);

  const handleSaveButtonClick = () => {
    axios.post('http://localhost:3001/update-client-name', { newName })
      .then(response => {
        setError('Name Updated Successfully');
        setIsModalOpen(true);
      })
      .catch(error => {
        console.error(error);
        setError('Name Update Failed: ' + error.response.data.message);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/HomeForClient');
  };

  const handleBackClick = () => {
    // Navigate to Home
    navigate('/HomeForClient');
  };

  return (
    <div className="UpdateNameContainer"> {/* Use a different class name for styling */}
    <button onClick={handleBackClick}>
        Back
      </button>
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Name Update Modal"
      >
        <p>{error}</p>
        <button onClick={closeModal}>OK</button>
      </Modal>
    </div>
  );
};

export default UpdateNameClient;
