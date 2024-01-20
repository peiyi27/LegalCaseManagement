import dayjs from 'dayjs';
import 'dayjs/locale/en';
import dayLocaleData from 'dayjs/plugin/localeData';
import { Button, message, Space, Calendar, List, Col, Radio, Row, Select, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';
import './EventManagementStaff.css';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AlertNotificationManagement from './AlertNotificationManagement';
import { useNavigate } from 'react-router-dom';
import legalHomeLogo from './logo.png';
import axios from 'axios';


dayjs.extend(dayLocaleData);
dayjs.locale('en');

const EventManagementStaff = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);  

  useEffect(() => {
    axios.get('http://localhost:3001/get-all-events-admin')
      .then(response => {
        console.log('Events:', response.data.events);
        setEvents(response.data.events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);


  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const dateFullCellRender = (value) => {
    const day = value.date();
    const isEventDate = events.some((event) => dayjs(event.event_date).isSame(value, 'day'));    const [messageApi, contextHolder] = message.useMessage();
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

  const handleHomeStaffClick = () => {
    navigate('/HomeforStaff');
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
        <div className="main-notification-container">
          <AlertNotificationManagement />
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
               <a href="#home" onClick={handleHomeStaffClick}>Home</a>
           </li>
            <li>
              <a href="#casematter" onClick={handleCaseManagementClick}>
                My Cases
              </a>
            </li>
            <li>
              <a href="#casematter" onClick={handleEventManagementClick} style={{ color: '#f6d41e' }}>
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
                {dayjs(item.event_date).format('YYYY-MM-DD')}: {item.event_name}
                <br />
                {item.event_time_start} - {item.event_time_end}
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

export default EventManagementStaff;
