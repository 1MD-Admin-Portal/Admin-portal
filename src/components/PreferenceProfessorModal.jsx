import React, { useState } from 'react';

const PreferenceProfessorModal = ({ professor, onClose }) => {
  const [experience, setExperience] = useState(professor.experience || '1-3 years');
  const [styles, setStyles] = useState(professor.styles || ['Salsa']);
  const [availability, setAvailability] = useState(professor.availability || '1-2 times/Week');
  const [goal, setGoal] = useState(professor.goal || 'Help students grow');
  const [showDropdown, setShowDropdown] = useState(false);

  const allStyles = ['Salsa', 'Ballet', 'Hip Hop', 'Contemporary', 'Jazz', 'Tap', 'Ballroom', 'Kizomba'];

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStyleSelect = (styleName) => {
    setStyles(prev =>
      prev.includes(styleName)
        ? prev.filter(s => s !== styleName)
        : [...prev, styleName]
    );
    setShowDropdown(false);
  };

  const sortedStyles = [...styles, ...allStyles.filter(s => !styles.includes(s))];

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Teaching Preferences for {professor.name}</h2>

        <label>
          Experience:
          <select value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option>1-3 years</option>
            <option>3-5 years</option>
            <option>5+ years</option>
          </select>
        </label>

        <label>
          Teaching Styles:
          <div className="custom-dropdown">
            <div className="dropdown-display" onClick={toggleDropdown}>
              {styles.length > 0 ? styles.join(', ') : 'Select Teaching Styles'}
            </div>
            {showDropdown && (
              <div className="dropdown-options">
                {sortedStyles.map((styleName) => (
                  <div
                    key={styleName}
                    className={`option ${styles.includes(styleName) ? 'selected' : ''}`}
                    onClick={() => handleStyleSelect(styleName)}
                  >
                    {styleName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </label>

        <label>
          Availability:
          <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option>1-2 times/Week</option>
            <option>3-5 times/Week</option>
            <option>Daily</option>
          </select>
        </label>

        <label>
          Teaching Goal:
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option>Help students grow</option>
            <option>Build a strong community</option>
            <option>Explore new teaching styles</option>
          </select>
        </label>

        <button onClick={onClose}>Save</button>
      </div>

      {/* Embedded styles */}
      <style jsx>{`
        .custom-dropdown {
          position: relative;
          width: 100%;
          margin-top: 8px;
        }
        .dropdown-display {
          padding: 8px;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
        }
        .dropdown-options {
          position: absolute;
          width: 100%;
          background: #fff;
          border: 1px solid #ccc;
          max-height: 200px;
          overflow-y: auto;
          z-index: 100;
        }
        .option {
          padding: 8px;
          cursor: pointer;
        }
        .option:hover {
          background: #f0f0f0;
        }
        .option.selected {
          font-weight: bold;
          background: #e0f7fa;
        }
      `}</style>
    </div>
  );
};

export default PreferenceProfessorModal;
