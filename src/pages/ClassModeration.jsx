import React, { useState } from 'react';
import '../styles/ClassModeration.css';

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
          {classData.map((classItem, index) => (
            <tr key={index}>
              <td>{classItem.instructor}</td>
              <td>{classItem.title}</td>
              <td>{classItem.type}</td>
              <td>{classItem.capacity}</td>
              <td>{classItem.price}</td>
              <td>{classItem.slots}</td>
              <td>
                <span className="status-label">{classItem.status}</span>
              </td>
              <td className="class-actions">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassModeration;
