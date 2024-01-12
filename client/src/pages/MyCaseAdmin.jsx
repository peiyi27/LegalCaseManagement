import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyCaseAdmin.css';
import { useNavigate } from 'react-router-dom';


const MyCaseAdmin = () => {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all cases from the server
    axios.get('http://localhost:3001/get-cases-staff')
      .then(response => {
        console.log('Cases:', response.data.cases);
        setCases(response.data.cases);
      })
      .catch(error => console.error('Error fetching cases:', error));
  }, []);

  const handleCreateCaseClick = () => {
    // Navigate to CreateCaseForm
    navigate('/CreateMyCaseFormAdmin');
  };

  const handleBackClick = () => {
    // Navigate to Home
    navigate('/Home');
  };

  const handleViewClick = (caseId) => {
    navigate(`/ViewMyCaseAdmin/${caseId}`);
    // Handle View button click, you can navigate to a specific view page or perform any action
    console.log(`View clicked for caseId: ${caseId}`);
  };

  const handleEditClick = (caseId) => {
    navigate(`/EditMyCaseAdmin/${caseId}`);
    // Handle Edit button click, you can navigate to an edit page or perform any action
    console.log(`Edit clicked for caseId: ${caseId}`);
  };

  const handleDocumentClick = (caseId) => {
    navigate(`/DocumentManagementMyCaseAdmin/${caseId}`);
    // Handle Edit button click, you can navigate to an edit page or perform any action
  };

  const handleDeleteClick = async (caseId) => {
    // Prompt a confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this case?");
  
    if (confirmDelete) {
      try {
        // If the user confirms, make an API call to delete the case using axios or your preferred method
        const response = await axios.delete(`http://localhost:3001/delete-case/${caseId}`, { withCredentials: true });
  
        console.log(response.data);
  
        // Check if the deletion was successful
        if (response.data.success) {
          // Refresh the cases or perform any necessary actions after successful deletion
          const updatedCasesResponse = await axios.get('http://localhost:3001/get-cases-staff');
          setCases(updatedCasesResponse.data.cases);
        } else {
          // Handle deletion failure, display an error message, etc.
          console.error('Error deleting case:', response.data.message);
        }
      } catch (error) {
        // Handle AJAX error
        console.error('Error deleting case:', error);
      }
    } else {
      // If the user cancels, you can handle it or do nothing
      console.log(`Delete cancelled for caseId: ${caseId}`);
    }
  };
  


  return (
    <div className="case-management">
      <h2>Case Management</h2>
      <button className="create-case-button" onClick={handleCreateCaseClick}>
        Create Case
      </button>
      <button className="create-back-button" onClick={handleBackClick}>
        Back
      </button>
      {cases.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Case ID</th>
              <th>Case Name</th>
              <th>Case Type</th>
              <th>Case Status</th>
              <th>Staff Name</th>
              <th>Client Name</th>
              <th>Actions</th> {/* Added Actions header */}
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{caseItem.case_id}</td>
                <td>{caseItem.case_name}</td>
                <td>{caseItem.case_type}</td>
                <td>{caseItem.case_status}</td>
                <td>{caseItem.staff_name}</td>
                <td>{caseItem.client_name}</td>
                <td>
                  <button onClick={() => handleViewClick(caseItem.case_id)}>View</button>
                  <button onClick={() => handleEditClick(caseItem.case_id)}>Edit</button>
                  <button onClick={() => handleDeleteClick(caseItem.case_id)}>Delete</button>
                  <button onClick={() => handleDocumentClick(caseItem.case_id)}>Document</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cases available.</p>
      )}
    </div>
  );
};

export default MyCaseAdmin;
