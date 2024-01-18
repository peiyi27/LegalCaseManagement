import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlertNotificationManagement.css';

const AlertNotificationManagement = () => {
  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    axios.get('/api/alert/events/upcoming')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching alert events:', error);
      });

    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
  };

  return (
    <div className="alert-container">
      <div className="date-time-display">
        <div className="date-display">
          {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="time-display">
          {formatTime(currentTime)}
        </div>
      </div>
      {events.length > 0 ? (
        events.map(event => (
          <div key={event.event_id} className="event-display">
            <div className="event-name">{event.event_name}</div>
            <div className="event-info">
              {event.event_date} at {event.event_time_start}
            </div>
          </div>
        ))
      ) : (
        <div className="no-events">No upcoming events.</div>
      )}
    </div>
  );
};

export default AlertNotificationManagement;