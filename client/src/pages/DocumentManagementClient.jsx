import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import './DocumentManagementClient.css';

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
    const decodedContent = atob(documentContent); // Decode base64 content

    // Convert the decoded content to a Uint8Array
    const uint8Array = new Uint8Array(decodedContent.length);
    for (let i = 0; i < decodedContent.length; i++) {
      uint8Array[i] = decodedContent.charCodeAt(i);
    }

    // Determine the MIME type based on the document type
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
      mimeType = 'application/octet-stream'; // Default to octet-stream for unknown types
    }

    const blob = new Blob([uint8Array], { type: mimeType });

    // Use FileSaver.js to trigger the file download
    saveAs(blob, documentName);
  };

 
  return (
    <div className="case-documents-container">
      <div className="case-documents-header">
        <button onClick={handleBackClick}>Back</button>
      </div>
      <h2>Case Documents</h2>
      {documents.length > 0 ? (
        <table>
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
                  <button onClick={() => handleViewDocumentClick(document.documentId, document.name, document.content, document.documentType)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No documents available for this case.</p>
      )}
    </div>
  );
};

export default DocumentManagementClient;
