import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import './DocumentManagementClient.css';
import Swal from 'sweetalert2';

const DocumentManagementClient = () => {
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
    navigate(`/CaseManagementClient`);
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
  
    // Use SweetAlert2 for success notification
    Swal.fire({
      icon: 'success',
      title: 'Document Downloaded Successfully!',
      showConfirmButton: false,
      timer: 1500,
    });
  
    // Use FileSaver.js to trigger the file download
    saveAs(blob, documentName);
  };
  
  return (
    <div className="client-document-management-case">
      <div className="client-document-management-case-header">
        <button onClick={handleBackClick} className="client-document-management-case-button client-document-management-case-back-button">
          Back
        </button>
      </div>
      <h2 className="client-document-management-case-heading">Case Documents</h2>
      {documents.length > 0 ? (
        <table className="client-document-management-case-table">
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
                    className="client-document-management-case-button client-document-management-case-view-button"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="client-document-management-case-no-documents">No documents available for this case.</p>
      )}
    </div>
  );
};

export default DocumentManagementClient;
