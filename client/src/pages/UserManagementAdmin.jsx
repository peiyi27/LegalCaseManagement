import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserManagementAdmin.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AlertNotificationManagement from './AlertNotificationManagement';
import legalHomeLogo from './logo.png';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';




const UserManagementAdmin = () => {
    const [externalUsers, setExternalUsers] = useState([]);
    const [internalUsers, setInternalUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      const baseUrl = 'http://localhost:3001'; // Replace with your base URL
  
      // Fetch external user data
      axios.get(`${baseUrl}/admin-get-external-user`)
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            console.log('External Users Data:', data.userData);
            setExternalUsers(data.userData);
          }
        })
        .catch((error) => console.error('Error fetching external users:', error));
  
      // Fetch internal user data
      axios.get(`${baseUrl}/admin-get-internal-user`)
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            console.log('Internal Users Data:', data.adminData);
            setInternalUsers(data.adminData);
          }
        })
        .catch((error) => console.error('Error fetching internal users:', error));
    }, []);

    const handleDeleteInternalUser = (userId) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Continue with the deletion logic
          const baseUrl = 'http://localhost:3001'; // Replace with your base URL
          axios.delete(`${baseUrl}/admin-delete-internal-user/${userId}`)
            .then((response) => {
              if (response.data.success) {
                console.log(response.data.message);
    
                // Fetch updated internal users data after deletion
                axios.get(`${baseUrl}/admin-get-internal-user`)
                  .then((response) => response.data)
                  .then((data) => {
                    if (data.success) {
                      console.log('Updated Internal Users Data:', data.adminData);
                      setInternalUsers(data.adminData);
                    }
                  })
                  .catch((error) => console.error('Error fetching updated internal users:', error));
              } else {
                console.error(response.data.message);
              }
            })
            .catch((error) => console.error('Error deleting internal user:', error));
        }
      });
    };
    
    const handleDeleteExternalUser = (userId) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Continue with the deletion logic
          const baseUrl = 'http://localhost:3001'; // Replace with your base URL
          axios.delete(`${baseUrl}/admin-delete-external-user/${userId}`)
            .then((response) => {
              if (response.data.success) {
                console.log(response.data.message);
  
                // Fetch updated external users data after deletion
                axios.get(`${baseUrl}/admin-get-external-user`)
                  .then((response) => response.data)
                  .then((data) => {
                    if (data.success) {
                      console.log('Updated External Users Data:', data.userData);
                      setExternalUsers(data.userData);
                    }
                  })
                  .catch((error) => console.error('Error fetching updated external users:', error));
              } else {
                console.error(response.data.message);
              }
            })
            .catch((error) => console.error('Error deleting external user:', error));
        }
      });
    };
    
    const handleBackClick = () => {
        navigate(`/Home`);
      };

      const handleHomeAdminClick = () => {
        navigate('/Home');
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
    
      const handleEventManagementClick = () => {
        navigate('/EventManagementAdmin');
      };


      const handleMyCaseClick = () => {
        navigate('/MyCaseAdmin');
      };
    
  
      return (
        <div className="main-body">
          <header className="main-top-nav">
            <div>
              <h1 className="main-header">Apex Legal Solution</h1>
            </div>
            <div>
            <div className="main-notification-container">
             <AlertNotificationManagement />
             </div>
              <div className="main-setting-container1" onClick={() => navigate('/ProfileSettingAdmin')}>
                <FontAwesomeIcon icon={faCog} className="main-custom-icon1" />
              </div>
              <div className="main-icon-container2" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="main-custom-icon2" />
              </div>
            </div>
          </header>
          <aside className="main-side-nav">
            <nav>
              <ul>
                <li>
                <img src={legalHomeLogo} alt="Legal Logo" className="logo-test" />
                </li>
                <li>
                   <a href="#home" onClick={handleHomeAdminClick}>Home</a>
               </li>
                <li>
                  <a href="#clients" onClick={handleUserManagementClick} style={{ color: '#f6d41e' }}>User Management</a>
                </li>
                <li>
                  <a href="#case" onClick={handleCaseManagementClick}>Case Management</a>
                </li>
                <li>
                  <a href="#case" onClick={handleEventManagementClick}>Event Management</a>
                </li>

                <li>
                  <a href="#casematter" onClick={handleMyCaseClick}>
                    My Case
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="admin-user-content">
            <div className="admin-user-table-container">
              {/* External Users Table */}
              <div>
                <h2>External Users</h2>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {externalUsers.map((user) => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button onClick={() => handleDeleteExternalUser(user.userId)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Internal Users Table */}
              <div>
                <h2>Internal Users</h2>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {internalUsers.map((admin) => (
                      <tr key={admin.userId}>
                        <td>{admin.userId}</td>
                        <td>{admin.userName}</td>
                        <td>{admin.email}</td>
                        <td>{admin.role}</td>
                        <td>
                          <button onClick={() => handleDeleteInternalUser(admin.userId)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
          <button className="create-back-button" onClick={handleBackClick}>
          Back
        </button>
        </div>
      );
    };
    
  
  export default UserManagementAdmin;
