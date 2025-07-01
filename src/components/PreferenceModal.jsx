import React, { useState, useRef } from 'react';

const PreferenceModal = ({ dancer, onClose }) => {
  const [level, setLevel] = useState(dancer.level);
  const [style, setStyle] = useState(['Salsa', 'Bachata']);
  const [frequency, setFrequency] = useState('1-2 times/Week');
  const [goal, setGoal] = useState('Learn new dance style');
  const [showDropdown, setShowDropdown] = useState(false);

  const allStyles = ['Salsa', 'Bachata', 'Kizomba', 'Zouk', 'Cha Cha', 'Tango', 'Swing', 'Waltz'];

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStyleSelect = (styleName) => {
    setStyle(prev => {
      const updated = prev.includes(styleName)
        ? prev.filter(s => s !== styleName)
        : [...prev, styleName];
      return updated;
    });
    setShowDropdown(false); // close dropdown after each select
  };

  const sortedStyles = [...style, ...allStyles.filter(s => !style.includes(s))];

  return (
    <>
      <div className="modal-content">
        <h2>Edit Your Dance Preference</h2>

        <label>
          Level:
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>

        <label>
          Dance Styles:
          <div className="custom-dropdown">
            <div className="dropdown-display" onClick={toggleDropdown}>
              {style.length > 0 ? style.join(', ') : 'Select Dance Styles'}
            </div>
            {showDropdown && (
              <div className="dropdown-options">
                {sortedStyles.map((styleName) => (
                  <div
                    key={styleName}
                    className={`option ${style.includes(styleName) ? 'selected' : ''}`}
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
          Frequency:
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option>1-2 times/Week</option>
            <option>3-5 times/Week</option>
            <option>Daily</option>
          </select>
        </label>

        <label>
          Goal:
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option>Learn new dance style</option>
            <option>Improve skills</option>
          </select>
        </label>

        <button onClick={onClose}>Save</button>
      </div>

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
    </>
  );
};

export default PreferenceModal;
