import dayjs from 'dayjs';
import 'dayjs/locale/en';
import dayLocaleData from 'dayjs/plugin/localeData';
import { Button, message, Space, Calendar, List, Col, Radio, Row, Select, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';
import './EventManagementStaff.css';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
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
    { date: '2024-01-24', startTime: '10:00 AM', endTime: '12:00 PM', title: 'Formal Meeting with Mr. Henry' },
    { date: '2024-01-27', startTime: '02:30 PM', endTime: '04:00 PM', title: 'Evidence Inspection' },
    { date: '2024-01-28', startTime: '08:30 AM', endTime: '01:00 PM', title: 'Discussion of Case 007' },
    { date: '2024-01-30', startTime: '09:00 AM', endTime: '12:30 PM', title: 'Crime Scene 003 Investigation' },
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
    const isEventDate = events.some((event) => dayjs(event.date).isSame(value, 'day'));
    const [messageApi, contextHolder] = message.useMessage();
    const error = () => {
      messageApi.open({
        type: 'error',
        content: 'No event available',
      });
    };

return (
    <>
      {isEventDate ? (
        <Link to={`/ViewEventStaff`}>
          <Button
            type="text"
            className={`event-button event-date`}
            onClick={() => console.log(`Clicked on ${value.format('YYYY-MM-DD')}`)}
          >
            {day}
          </Button>
        </Link>
      ) : (
        <>
          {contextHolder}
            <Space>
              <Button
                type="text"
                className={`event-button`}
                onClick={error}
              >
                {day}
              </Button>
            </Space>
          </>
      )}
    </>
  );  
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCaseManagementClick = () => {
    navigate('/CaseManagementStaff');
  };

  const handleEventManagementClick = () => {
    navigate('/EventManagementStaff');
  };
  
  const handleViewEventStaff = () => {
    navigate('/ViewEventStaff');
  };

  const handleBackClick = () => {
    // Navigate to Home
    navigate('/HomeForStaff');
  };

  const handleCreateEvent = () => {
    navigate('/CreateEventForm');
  }

  return (
    <div>
      <header className="main-top-nav">
        <div>
          <h1 className="main-header">Apex Legal Solution</h1>
        </div>
        <div>
        <div className="main-notification-container" onClick={() => navigate('/AlertNotificationManagement')}>
          <FontAwesomeIcon icon={faBell} className="main-custom-bell-icon" />
        </div>
          <div className="main-setting-container1" onClick={() => navigate('/ProfileSettingClient')}>
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
              <a href="#casematter" onClick={handleCaseManagementClick}>
                My Cases
              </a>
            </li>
            <li>
              <a href="#casematter" onClick={handleEventManagementClick}>
                My Events
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
        <div className="button-container">
          <h2 className="list-header">List of Upcoming Events:</h2>
          <button className="create-event-button" onClick={handleCreateEvent}>
            Create Event
          </button>
        </div>
        <List
          className="list"
          dataSource={events}
          renderItem={(item) => (
          <List.Item>
            <a href="#casematter" onClick={handleViewEventStaff}>
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
