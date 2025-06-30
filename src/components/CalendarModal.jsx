import React, { useState } from 'react';

const CalendarModal = ({ dancer, onClose }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(year, month);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e-${i}`} className="calendar-cell empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;

      cells.push(
        <div
          key={day}
          className={`calendar-cell ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          {day}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="modal">
      <div className="modal-content calendar-modal-small">
        <h2>Select Date</h2>
        <div className="calendar-controls">
          <button onClick={prevMonth}>‹</button>
          <span>
            {currentDate.toLocaleString('default', { month: 'short' })} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth}>›</button>
        </div>
        <div className="calendar-grid-header">
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-day">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid-body">{renderDays()}</div>

        {selectedDate && (
          <p className="selected-date">📅 {selectedDate.toDateString()}</p>
        )}

        <button className="calendar-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CalendarModal;
