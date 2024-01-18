import dayjs from 'dayjs';
import 'dayjs/locale/en';
import dayLocaleData from 'dayjs/plugin/localeData';
import { Button, Calendar, List, Col, Radio, Row, Select, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';
import './EventManagementClient.css';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import legalHomeLogo from './logo.png';
import axios from 'axios';
import caseLogo from './case-logo.png';


dayjs.extend(dayLocaleData);
dayjs.locale('en');

const App = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [staffCount, setStaffCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [caseCount, setCaseCount] = useState(0);
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const events = [
    { date: '2023-12-01', startTime: '10:00 AM', endTime: '12:00 PM', title: 'Formal Meeting with Mr. Henry' },
    { date: '2023-12-05', startTime: '02:30 PM', endTime: '04:00 PM', title: 'Evidence Inspection' },
    { date: '2023-12-07', startTime: '08:30 AM', endTime: '02:00 PM', title: 'Discussion of Case 007' },
  ];
  

  useEffect(() => {
    const baseUrl = 'http://localhost:3001'; // Adjust the base URL based on your server configuration

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
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const dateFullCellRender = (value) => {
    const day = value.date();


    return (
      <Link to={`/ViewEventClient`}>
        <Button
          type="text"
          style={{ width: '70%', height: '100%', textAlign: 'center', margin: '0', padding: '0' }}
          onClick={() => console.log(`Clicked on ${value.format('YYYY-MM-DD')}`)}
        >
          {day}
        </Button>
      </Link>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCaseManagementClick = () => {
    navigate('/CaseManagementClient');
  };

  const handleEventManagementClick = () => {
    navigate('/EventManagementClient');
  };
  
  const handleViewEventClient = () => {
    navigate('/ViewEventClient');
  };

  const handleBackClick = () => {
    // Navigate to Home
    navigate('/HomeForClient');
  };

  return (
    <div>
      <header className="client-top-nav">
        <div>
          <img src={legalHomeLogo} alt="Legal Logo" className="client-logohome" />
          <h1 className="client-header">Apex Legal Solution</h1>
        </div>
        <div>
          <div className="client-setting-container1" onClick={() => navigate('/ProfileSettingClient')}>
            <FontAwesomeIcon icon={faCog} className="client-custom-icon1" />
          </div>
          <div className="client-icon-container2" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="client-custom-icon2" />
          </div>
        </div>
      </header>
      <aside className="client-side-nav">
        <nav>
          <ul>
            <li>
              <a href="#casematter" onClick={handleCaseManagementClick}>
                Case Management
              </a>
            </li>
            <li>
              <a href="#casematter" onClick={handleEventManagementClick}>
                Event Management
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="wrapper">
        <Calendar
          fullscreen={false}
          className='calendar'
          headerRender={({ value, type, onChange, onTypeChange }) => {
            const start = 0;
            const end = 12;
            const monthOptions = [];
            let current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = 0; i < 12; i++) {
              current = current.month(i);
              months.push(localeData.monthsShort(current));
            }
            for (let i = start; i < end; i++) {
              monthOptions.push(
                <Select.Option key={i} value={i} className="month-item">
                  {months[i]}
                </Select.Option>,
              );
            }
            const year = value.year();
            const month = value.month();
            const options = [];
            for (let i = year - 10; i < year + 10; i += 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>,
              );
            }
            return (
              <div
                style={{
                  padding: 8,
                }}
              >
                <Typography.Title level={4}>My Events</Typography.Title>
                <Row gutter={8}>
                  <Col>
                    <Radio.Group
                      size="small"
                      onChange={(e) => onTypeChange(e.target.value)}
                      value={type}
                    >
                      <Radio.Button value="month">Month</Radio.Button>
                      <Radio.Button value="year">Year</Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      className="my-year-select"
                      value={year}
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear);
                        onChange(now);
                      }}
                    >
                      {options}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      value={month}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth);
                        onChange(now);
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                </Row>
              </div>
            );
          }}
          onPanelChange={onPanelChange}
          dateFullCellRender={dateFullCellRender}
        />
        <h2 className="list-header">List of Upcoming Events:</h2>
        <List
          className="list"
          dataSource={events}
          renderItem={(item) => (
          <List.Item>
            <a href="#casematter" onClick={handleViewEventClient}>
              {dayjs(item.date).format('YYYY-MM-DD')}: {item.title}
              <br />
              {item.startTime} - {item.endTime}
            </a>
          </List.Item>
          )}
        />
        <button className="create-back-button" onClick={handleBackClick}>
          Back
        </button>
      </div>
    </div>
  );
};

export default App;
