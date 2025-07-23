import React, { useState } from "react";

const CalendarProfessorModal = ({ professor, onClose }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(null);

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDate(null);
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(year, month);
    const cells = [];

    const classDates = (professor.classes || []).map((cls) => ({
      ...cls,
      dateObj: new Date(cls.date),
    }));

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e-${i}`} className="calendar-cell empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const hasClass = classDates.some(
        (cls) => cls.dateObj.toDateString() === date.toDateString()
      );
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;

      cells.push(
        <div
          key={day}
          className={`calendar-cell ${hasClass ? "has-class" : ""} ${
            isSelected ? "selected" : ""
          }`}
          onClick={() => setSelectedDate(date)}
        >
          {day}
          {hasClass && <div className="class-dot">📍</div>}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="modal-content calendar-modal-small">
      <h2>{professor.name}'s Classes</h2>
      <div className="calendar-controls">
        <button onClick={prevMonth}>‹</button>
        <span>
          {currentDate.toLocaleString("default", { month: "short" })}{" "}
          {currentDate.getFullYear()}
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
        <div className="class-info">
          <p className="selected-date">📅 {selectedDate.toDateString()}</p>
          <ul>
            {(professor.classes || [])
              .filter(
                (cls) =>
                  new Date(cls.date).toDateString() ===
                  selectedDate.toDateString()
              )
              .map((cls, i) => (
                <li key={i}>🎓 {cls.title}</li>
              ))}
          </ul>
        </div>
      )}

      <button className="calendar-close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default CalendarProfessorModal;
