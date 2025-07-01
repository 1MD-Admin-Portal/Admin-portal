import React, { useState, useRef, useEffect } from 'react';
import '../styles/ClassModeration.css';
import { X } from 'lucide-react';

const classData = [
  {
    instructor: 'Amira P.',
    title: 'Salsa Fundamentals',
    type: 'Group',
    capacity: 15,
    price: '15$',
    slots: 5,
    status: 'Pending',
  },
  {
    instructor: 'Raj S.',
    title: 'Private Hip-Hop Session',
    type: '1-on-1',
    capacity: 7,
    price: '10$',
    slots: 5,
    status: 'Pending',
  },
  {
    instructor: 'Lucas M.',
    title: 'Beginner Bachata',
    type: 'Group',
    capacity: 20,
    price: '10$',
    slots: 5,
    status: 'Pending',
  },
  {
    instructor: 'Priya K.',
    title: 'Cha-Cha Private Lesson',
    type: '1-on-1',
    capacity: 7,
    price: '15$',
    slots: 5,
    status: 'Pending',
  },
];

const ClassModeration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApprove = (index) => {
    alert(`Approved: ${classData[index].title}`);
    setOpenDropdownIndex(null);
  };

  const handleReject = (index) => {
    alert(`Rejected: ${classData[index].title}`);
    setOpenDropdownIndex(null);
  };

  const filteredClasses = classData.filter((classItem) =>
    classItem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="class-moderation-container">
      <h1 className="class-moderation-header">Class Moderation</h1>

      <div className="class-moderation-actions">
        <div className="class-moderation-search">
          <span role="img" aria-label="search">🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="class-moderation-filter">
          <option>Instructor</option>
        </select>
        <select className="class-moderation-filter">
          <option>Type</option>
        </select>
        <select className="class-moderation-filter">
          <option>Status</option>
        </select>
        <select className="class-moderation-filter">
          <option>Date</option>
        </select>

        <button className="approve-all-btn">Approve All</button>
      </div>

      <table className="class-table">
        <thead>
          <tr>
            <th>Instructor</th>
            <th>Title</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Price</th>
            <th>Slots per day</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredClasses.map((classItem, index) => (
            <tr
              key={index}
              className="clickable-row"
              onClick={() => setSelectedClass(classItem)}
            >
              <td>{classItem.instructor}</td>
              <td>{classItem.title}</td>
              <td>{classItem.type}</td>
              <td>{classItem.capacity}</td>
              <td>{classItem.price}</td>
              <td>{classItem.slots}</td>
              <td>
                <span className="status-label">{classItem.status}</span>
              </td>
              <td className="class-actions" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
                <span onClick={() => setOpenDropdownIndex(index)}>⋮</span>
                {openDropdownIndex === index && (
                  <div className="dropdown-menu" ref={dropdownRef}>
                    <div onClick={() => handleApprove(index)}>Approve</div>
                    <div onClick={() => handleReject(index)}>Reject</div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Popup */}
      {selectedClass && (
        <div className="class-popup-overlay" onClick={() => setSelectedClass(null)}>
          <div className="class-popup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>{selectedClass.title}</h2>
              <X className="popup-close" onClick={() => setSelectedClass(null)} />
            </div>
            <p><strong>Instructor:</strong> {selectedClass.instructor}</p>
            <p><strong>Type:</strong> {selectedClass.type}</p>
            <p><strong>Capacity:</strong> {selectedClass.capacity}</p>
            <p><strong>Slots/Day:</strong> {selectedClass.slots}</p>
            <p><strong>Price:</strong> {selectedClass.price}</p>
            <p><strong>Status:</strong> {selectedClass.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassModeration;
