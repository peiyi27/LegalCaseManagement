import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyCaseAdmin.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import legalHomeLogo from './logo.png';
import Swal from 'sweetalert2';

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
    // Prompt a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this case.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        // If the user confirms, make an API call to delete the case using axios or your preferred method
        const response = await axios.delete(`http://localhost:3001/delete-case/${caseId}`, { withCredentials: true });

        console.log(response.data);

        // Check if the deletion was successful
        if (response.data.success) {
          // Refresh the cases or perform any necessary actions after successful deletion
          const updatedCasesResponse = await axios.get('http://localhost:3001/get-cases-staff');
          setCases(updatedCasesResponse.data.cases);

          // Show success message using SweetAlert2
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The case has been deleted successfully.',
          });
        } else {
          // Handle deletion failure, display an error message, etc.
          console.error('Error deleting case:', response.data.message);

          // Show error message using SweetAlert2
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to delete the case. Please try again.',
          });
        }
      } catch (error) {
        // Handle AJAX error
        console.error('Error deleting case:', error);

        // Show error message using SweetAlert2
        await Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while deleting the case.',
        });
      }
    } else {
      // If the user cancels, you can handle it or do nothing
      console.log(`Delete cancelled for caseId: ${caseId}`);
    }
  };
  
  
 const handleLogout = () => {
  localStorage.removeItem('token');
  navigate('/login');
};

const handleUserManagementClick = () => {
  navigate('/UserManagementAdmin');
};

const handleCaseManagementClick = () => {
  navigate('/CaseManagementAdmin');
};

const handleMyCaseClick = () => {
  navigate('/MyCaseAdmin');
};

return (
  <div>
  <header className="admin-mycase-top-nav">
    <div>
      <img src={legalHomeLogo} alt="Legal Logo" className="admin-mycase-logohome" />
      <h1 className="admin-mycase-header">Apex Legal Solution</h1>
    </div>
    <div>
      <div className="admin-mycase-setting-container1" onClick={() => navigate('/ProfileSettingAdmin')}>
        <FontAwesomeIcon icon={faCog} className="admin-mycase-custom-icon1" />
      </div>
      <div className="admin-mycase-icon-container2" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="admin-mycase-custom-icon2" />
      </div>
    </div>
  </header>
  <aside className="admin-mycase-side-nav">
  <nav>
        <ul>
          <li>
            <a href="#clients" onClick={handleUserManagementClick}>User Management</a>
          </li>
          <li>
            <a href="#case" onClick={handleCaseManagementClick}>Case Management</a>
          </li>
          <li>
            <a href="#casematter" onClick={handleMyCaseClick}>
              My Case
            </a>
          </li>
        </ul>
      </nav>
  </aside>
  <main className="admin-mycase-content">
    <div>
<div className="admin-mycase-management">
  <h2>My Case</h2>
  <button className="create-back-button" onClick={handleBackClick}>
    Back
  </button>
  <button className="create-case-button" onClick={handleCreateCaseClick}>
    Create Case
  </button>
  <div className="table-container">
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
            <th className="admin-case-actions-header">Actions</th> {/* Added Actions header */}
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
              <td className="admin-case-actions-cell">
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
</div>
</div>
  </main>
</div>

);
};

export default MyCaseAdmin;
