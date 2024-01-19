import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Menu, Badge, Button, Space } from 'antd'; // Ensure you have antd installed
import { BellOutlined } from '@ant-design/icons'; // Ensure you have ant-design/icons installed
import './AlertNotificationManagement.css';

const AlertNotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Replace this with the actual endpoint where you fetch notifications
    axios.get('/api/alert/notifications')
      .then(response => {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  const handleNotificationClick = (notification) => {
    // Logic to handle notification click
  };

  const handleClearNotifications = () => {
    // Logic to clear all notifications
  };

  return (
  <div className="headerRightRight">
    <div className="notification-wrapper">
      <Dropdown
        overlay={
          <Menu className="notification-menu">
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
            {notifications.length > 0 && (
              <Menu.Item className="text-center">
                <Button type="link" onClick={handleClearNotifications}>
                  Clear All Notifications
                </Button>
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Badge count={unreadCount}>
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
