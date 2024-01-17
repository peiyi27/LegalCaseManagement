// src/Calendar.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EventManagementClient.css'; // Import custom styles
import ViewEventClient from './ViewEventClient';

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [viewEvent, setViewEvent] = useState(false);

  const onChange = (newDate) => {
    setDate(newDate);
     setViewEvent(true);
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-header">My Calendar</h2>
      {
        viewEvent ? 
          <ViewEventClient date={date} onBack={() => setViewEvent(false)} /> :
          <Calendar
            onChange={onChange}
            value={date}
            className="custom-calendar"
            // This will render each calendar tile (i.e., day) as a button
            tileContent={({ date, view }) => (
              view === 'month' && (
                <button 
                  onClick={() => onChange(date)} 
                  className="calendar-day-button"
                >
                </button>
              )
            )}
          />
      }
    </div>
  );
};

export default MyCalendar;