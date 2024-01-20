import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import './NotificationListAdmin.css';
import 'dayjs/locale/en';
import dayLocaleData from 'dayjs/plugin/localeData';
import { Button, message, Space, Calendar, List, Col, Radio, Row, Select, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AlertNotificationManagement from './AlertNotificationManagement';
import { useNavigate } from 'react-router-dom';
import legalHomeLogo from './logo.png';

const NotificationListAdmin = () => {
  const currentDate = dayjs().format('YYYY-MM-DD');
  const [events, setEvents] = useState([]);  

  useEffect(() => {
    axios.get('http://localhost:3001/get-all-events-admin')
      .then(response => {
        console.log('Events:', response.data.events);
        setEvents(response.data.events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);


  const isEventToday = (eventDate) => {
    return dayjs(eventDate).isSame(currentDate, 'day');
  };

  return (
    <div className="notification-list-admin">
      <div className="current-date-box">
        {events.some(event => isEventToday(event.event_date)) ? (
          events.filter(event => isEventToday(event.event_date)).map(event => (
            <div key={event.event_id} className="event-item">
              <h3>{event.event_name}</h3>
              <p>{event.event_desc}</p>
            </div>
          ))
        ) : (
          <div className="no-event">No Notifications</div>
        )}
      </div>
      <div className="upcoming-events">
        <h2>Upcoming Events:</h2>
        <List
          className="list"
          dataSource={events}
          renderItem={(item) => (
            <List.Item>
              <a href="#casematter">
                {dayjs(item.event_date).format('YYYY-MM-DD')}: {item.event_name}
                <br />
                {item.event_time_start} - {item.event_time_end}
              </a>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default NotificationListAdmin;
