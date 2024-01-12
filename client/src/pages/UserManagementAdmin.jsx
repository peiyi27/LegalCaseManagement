import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserManagementAdmin.css'; 


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
        const baseUrl = 'http://localhost:3001'; // Replace with your base URL
        const shouldDelete = window.confirm(`Are you sure you want to delete the user?`);
      
        if (shouldDelete) {
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
      };
      
      const handleDeleteExternalUser = (userId) => {
        const baseUrl = 'http://localhost:3001'; // Replace with your base URL
        const shouldDelete = window.confirm(`Are you sure you want to delete the user?`);
      
        if (shouldDelete) {
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
      };
      
    
    const handleBackClick = () => {
        navigate(`/Home`);
      };
  
    return (
      <div>
        {/* Back button */}
        <button  onClick={handleBackClick}>
          Back
        </button>
        {/* External Users Table */}
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
  
        {/* Internal Users Table */}
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
    );
  };
  
  export default UserManagementAdmin;
