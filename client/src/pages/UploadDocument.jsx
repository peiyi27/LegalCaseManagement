import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UploadDocument = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('pdf'); // Default file type
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleOpenConfirmation = () => {
    if (!title || !file) {
      alert('Please provide title and select a file.');
      return;
    }
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);
      formData.append('caseId', caseId);
      formData.append('fileType', fileType);

      const response = await axios.post('http://localhost:3001/upload-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Document uploaded successfully.');
        navigate(`/DocumentManagement/${caseId}`);
      } else {
        alert('Error uploading document. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setConfirmationOpen(false);
    }
  };

  const handleBackClick = () => {
    navigate(`/DocumentManagement/${caseId}`);
  };

  return (
    <div className="upload-document-container">
      <h2>Upload Document</h2>
      <button onClick={handleBackClick}>Back</button>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={handleTitleChange} />
      </div>
      <div>
        <label htmlFor="file">Choose File:</label>
        <input type="file" id="file" onChange={handleFileChange} />
      </div>
      <div>
        <label htmlFor="fileType">File Type:</label>
        <select id="fileType" value={fileType} onChange={handleFileTypeChange}>
          <option value="pdf">pdf</option>
          <option value="docx">docx</option>
          <option value="xlsx">xlsx</option>
          <option value="png">png</option>
          <option value="jpg">jpg</option>
          <option value="jpeg">jpeg</option>
          <option value="mp3">mp3</option>
          <option value="mp4">mp4</option>
        </select>
      </div>
      <p>Maximum file size: 2GB</p>
      <button onClick={handleOpenConfirmation}>Confirm Save</button>

      {isConfirmationOpen && (
        <div className="confirmation-modal">
          <p>Confirm Save?</p>
          <button onClick={handleUpload}>Yes</button>
          <button onClick={handleCloseConfirmation}>No</button>
        </div>
      )}
    </div>
  );
};

export default UploadDocument;
