import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import legalHomeLogo from './logo.png';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // Add any logic for user logout, e.g., clearing the token from localStorage
    localStorage.removeItem('token');
    // Navigate to the login page
    navigate('/login');
  };

   // Function to handle navigation to CreateCaseForm
  const handleCreateCaseClick = () => {
    // Navigate to the CreateCaseForm page
    navigate('/CreateCaseForm');
  };

  return (
    <div>
      <header className="home-top-nav">
        <div>
          {/* Logo and other elements can go here */}
          <img src={legalHomeLogo} alt="Legal Logo" className="logohome" />
          <h1 className='home-header'> Apex Legal Solution</h1>
        </div>
        <div>
          {/* Setting icon */}
          <div className="setting-container1" onClick={() => navigate('/ProfileSetting')}>
            <FontAwesomeIcon icon={faCog} className="custom-icon1" />
          </div>
          {/* Logout icon */}
          <div className="icon-container2" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="custom-icon2" />
          </div>
        </div>
      </header>
      <aside className="home-side-nav">
        <nav>
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#clients">Clients</a></li>
            <li><a href="#casematter" onClick={handleCreateCaseClick}>Case/Matter</a></li>
            {/* ... other nav items */}
          </ul>
        </nav>
      </aside>
      <main className="home-content">
        <section id="dashboard">
          {/* Dashboard content goes here */}
        </section>
        <section id="clients">
          {/* Clients content goes here */}
        </section>
        <section id="casematter">
          {/* Case/Matter content goes here */}
        </section>
        {/* ... other sections */}
      </main>
    </div>
  );
  
  }
export default HomePage;