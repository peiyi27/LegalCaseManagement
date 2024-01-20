import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Menu, Badge, List, Button, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import './AlertNotificationManagement.css';
import dayjs from 'dayjs';


const AlertNotificationManagement = () => {
  const [events, setEvents] = useState([]); 
  const [notifications, setNotifications] = useState([]); 

  useEffect(() => {
    axios.get('http://localhost:3001/get-all-events-admin')
      .then(response => {
        console.log('Events:', response.data.events);
        setEvents(response.data.events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);
  const handleNotificationClick = (notification) => {
    // Logic to handle notification click
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([])); // Clear notifications in local storage
  };

  return (
    <div className="headerRightRight">
      <div className="notification-wrapper">
      <Dropdown
  overlay={
    <Menu className="notification-menu" style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {events.length === 0 ? (
        <Menu.Item disabled>No notifications</Menu.Item>
      ) : (
        events.slice(0, 4).map((event) => (
          <Menu.Item key={event.event_id}>
            <a href="#casematter">
              {dayjs(event.event_date).format('YYYY-MM-DD')}: {event.event_name}
              <br />
              {event.event_time_start} - {event.event_time_end}
            </a>
          </Menu.Item>
        ))
      )}
      <Menu.Item className="text-center">
        <Button type="link" onClick={handleClearNotifications}>
          Clear All Notifications
        </Button>
      </Menu.Item>
    </Menu>          }
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Badge count={notifications.length}>
                <span className="notification-icon">
                  <BellOutlined />
                </span>
              </Badge>
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default AlertNotificationManagement;