import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import './DocumentManagementMyCaseAdmin.css';
import Swal from 'sweetalert2';

const DocumentManagementMyCaseAdmin = () => {
  const [documents, setDocuments] = useState([]);
  const { caseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch documents associated with the case
    axios.get(`http://localhost:3001/get-case-documents/${caseId}`)
      .then(response => {
        console.log('Case Documents:', response.data.documents);
        setDocuments(response.data.documents);
      })
      .catch(error => console.error('Error fetching case documents:', error));
  }, [caseId]);

  const handleBackClick = () => {
    // Navigate back to the case details page
    navigate(`/MyCaseAdmin`);
  };

  const handleUploadDocumentClick = () => {
    // Navigate to the document upload page
    navigate(`/UploadDocumentMyCaseAdmin/${caseId}`);
  };

 
const handleViewDocumentClick = (documentId, documentName, documentContent, documentType) => {
  const decodedContent = atob(documentContent);
  const uint8Array = new Uint8Array(decodedContent.length);
  for (let i = 0; i < decodedContent.length; i++) {
    uint8Array[i] = decodedContent.charCodeAt(i);
  }

  let mimeType;

  if (documentType === 'pdf') {
    mimeType = 'application/pdf';
  } else if (documentType === 'docx') {
    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  } else if (documentType === 'xlsx') {
    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (documentType === 'png') {
    mimeType = 'image/png';
  } else if (documentType === 'jpg' || documentType === 'jpeg') {
    mimeType = 'image/jpeg';
  } else if (documentType === 'mp3') {
    mimeType = 'audio/mp3';
  } else if (documentType === 'mp4') {
    mimeType = 'video/mp4';
  } else {
    mimeType = 'application/octet-stream';
  }

  const blob = new Blob([uint8Array], { type: mimeType });

  saveAs(blob, documentName);

  // Show success toast using SweetAlert2
  Swal.fire({
    icon: 'success',
    title: 'Document Downloaded Successfully!',
    showConfirmButton: false,
    timer: 1500,
  });
};

const handleDeleteDocumentClick = async (documentId) => {
  // Use SweetAlert2 for delete confirmation
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: 'You want to delete this document.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (isConfirmed) {
    deleteDocument(documentId);
  }
};

const deleteDocument = async (documentId) => {
  try {
    const response = await axios.delete(`http://localhost:3001/delete-document/${documentId}`);

    if (response.data.success) {
      // Use SweetAlert2 for delete success
      Swal.fire({
        icon: 'success',
        title: 'Document Deleted Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      const updatedDocuments = await axios.get(`http://localhost:3001/get-case-documents/${caseId}`);
      setDocuments(updatedDocuments.data.documents);
    } else {
      // Use SweetAlert2 for delete error
      Swal.fire({
        icon: 'error',
        title: 'Error Deleting Document',
        text: 'Please try again.',
      });
    }
  } catch (error) {
    // Use SweetAlert2 for unexpected error
    Swal.fire({
      icon: 'error',
      title: 'Unexpected Error',
      text: 'An unexpected error occurred. Please try again.',
    });
    console.error('Error deleting document:', error);
  }
};


  return (
    <div className="admin-document-management-mycase">
      <div className="admin-document-management-mycase-header">
        <button onClick={handleBackClick} className="admin-document-management-mycase-button admin-document-management-mycase-back-button">
          Back
        </button>
        <button onClick={handleUploadDocumentClick} className="admin-document-management-mycase-button admin-document-management-mycase-upload-button">
          Upload Document
        </button>
      </div>
      <h2 className="admin-document-management-mycase-heading">Case Documents</h2>
      {documents.length > 0 ? (
        <table className="admin-document-management-mycase-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Filename</th>
              <th>File Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{document.name}</td>
                <td>{document.documentType}</td>
                <td>
                  <button
                    onClick={() =>
                      handleViewDocumentClick(document.documentId, document.name, document.content, document.documentType)
                    }
                    className="admin-document-management-mycase-button admin-document-management-mycase-view-button"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteDocumentClick(document.documentId)}
                    className="admin-document-management-mycase-button admin-document-management-mycase-delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="admin-document-management-mycase-no-documents">No documents available for this case.</p>
      )}
    </div>
  );
};

export default DocumentManagementMyCaseAdmin;
