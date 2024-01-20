import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Menu, Button, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import './AlertNotificationManagement.css';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const AlertNotificationManagement = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    axios.get('http://localhost:3001/get-all-events-admin')
      .then(response => {
        const todaysEvents = response.data.events.filter(event =>
          dayjs(event.event_date).format('YYYY-MM-DD') === today);
        setEvents(todaysEvents);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, [today]);

  const handleNotificationClick = (event) => {
    // Logic to handle notification click
  };

  const handleGoToNotifications = () => {
    navigate('/NotificationListAdmin');
  };

  return (
    <div className="headerRightRight">
      <div className="notification-wrapper">
        <Dropdown
          overlay={
            <Menu className="notification-menu" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {events.length === 0 && (
                <Menu.Item disabled>No notifications for today</Menu.Item>
              )}
              {events.map((event) => (
                <Menu.Item key={event.event_id} onClick={() => handleNotificationClick(event)}>
                  <h4> {event.event_name} </h4>
                    <p> {event.event_time_start} - {event.event_time_end}</p>
                </Menu.Item>
              ))}
              <Menu.Item className="text-center">
                <Button type="link" onClick={handleGoToNotifications}>
                  View All Notifications
                </Button>
              </Menu.Item>
            </Menu>
          }
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <span className="notification-icon">
                <BellOutlined />
              </span>
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default AlertNotificationManagement;