import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import './NotificationListAdmin.css';
import 'dayjs/locale/en';
import { List } from 'antd';

const NotificationListAdmin = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/get-all-events-admin')
      .then(response => {
        setEvents(response.data.events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const groupedEvents = events.reduce((grouped, event) => {
    const date = dayjs(event.event_date).format('YYYY-MM-DD');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
    return grouped;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="alert-list-notification-list-admin">
      {sortedDates.map(date => (
        <div key={date} className="alert-list-date-section">
          <div className="alert-list-date-header">{date}</div>
          <List
            className="list"
            dataSource={groupedEvents[date]}
            renderItem={item => (
              <List.Item className="alert-list-event-box">
                <div className="alert-list-event-details">
                  <h3>{item.event_name}</h3>
                  <p>{item.event_time_start} - {item.event_time_end}</p>
                </div>
              </List.Item>
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationListAdmin;
