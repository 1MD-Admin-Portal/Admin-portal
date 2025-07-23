import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DjCalendar = ({ user, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user.name}'s Classes</h2>
          <span onClick={onClose} className="modal-close">
            ✖
          </span>
        </div>
        <Calendar
          tileContent={({ date }) => {
            const match = user.classes?.find(
              (c) => new Date(c.date).toDateString() === date.toDateString()
            );
            return match ? (
              <div className="calendar-event">{match.title}</div>
            ) : null;
          }}
        />
      </div>
    </div>
  );
};

export default DjCalendar;
