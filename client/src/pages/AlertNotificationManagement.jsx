import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Menu, Badge, Button, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import './AlertNotificationManagement.css';

const AlertNotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from the API
    axios.get('/api/alert/notifications')
      .then(response => {
        setNotifications(response.data.notifications);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
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
              {notifications.length === 0 ? (
                <Menu.Item disabled>No notifications</Menu.Item>
              ) : (
                notifications.slice(0, 4).map((notification) => (
                  <Menu.Item
                    key={notification.id}
                    className={notification.read ? "notification-read" : "notification-unread"}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p>
                      {notification.event_desc} scheduled at {notification.event_date} for the Case: {notification.event_name}
                    </p>
                  </Menu.Item>
                ))
              )}
              <Menu.Item className="text-center">
                <Button type="link" onClick={handleClearNotifications}>
                  Clear All Notifications
                </Button>
              </Menu.Item>
            </Menu>
          }
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