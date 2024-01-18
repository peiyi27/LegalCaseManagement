import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AlertNotificationManagement.css';

const AlertNotificationManagement = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/alert/events/upcoming')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching alert events:', error);
      });
  }, []);

  return (
    <div className="alert-notification-icon">
      {/* Add your notification icon here */}
      <div className="notification-dropdown">
        {events.length > 0 ? (
          events.map(event => (
            <Link to={`/alert/event/${event.event_id}`} key={event.event_id} className="notification-item">
              <div className="notification-title">{event.event_name}</div>
              <div className="notification-info">
                {event.event_date} at {event.event_time_start}
              </div>
            </Link>
          ))
        ) : (
          <div className="notification-item">No upcoming events.</div>
        )}
      </div>
    </div>
  );
};

export default AlertNotificationManagement;
