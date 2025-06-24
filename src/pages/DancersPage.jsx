import React, { useState } from 'react';
import '../styles/DancersPage.css';
import { FaSearch } from 'react-icons/fa';

const dancers = [
  {
    id: 101,
    name: 'Maya Rivers',
    email: 'maya.rivers@example.com',
    subscription: 'Douceur',
    level: 'Intermediate',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: 102,
    name: 'Leo Martinez',
    email: 'leo.martinez@example.com',
    subscription: 'Ginga',
    level: 'Beginner',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    id: 103,
    name: 'Aisha Kapoor',
    email: 'aisha.k@example.com',
    subscription: 'Fiver',
    level: 'Advanced',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
];

const DancersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredDancers = dancers.filter((dancer) => {
    return (
      dancer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (subscriptionFilter === '' || dancer.subscription === subscriptionFilter) &&
      (levelFilter === '' || dancer.level === levelFilter) &&
      (statusFilter === '' || dancer.status === statusFilter)
    );
  });

  return (
    <div className="dancers-container">
      <div className="header">
        <h2>Dancers</h2>
      </div>

      <div className="top-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <select value={subscriptionFilter} onChange={(e) => setSubscriptionFilter(e.target.value)}>
            <option value="">All Subscriptions</option>
            <option value="Douceur">Douceur</option>
            <option value="Ginga">Ginga</option>
            <option value="Fiver">Fiver</option>
          </select>

          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <table className="dancers-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subscription</th>
            <th>Dance Level</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredDancers.map((dancer) => (
            <tr key={dancer.id}>
              <td>{dancer.id}</td>
              <td className="user-info">
                <img src={dancer.avatar} alt="avatar" />
                {dancer.name}
              </td>
              <td>{dancer.email}</td>
              <td>
                <span className={`badge ${dancer.subscription.toLowerCase()}`}>
                  {dancer.subscription}
                </span>
              </td>
              <td>{dancer.level}</td>
              <td>{dancer.status}</td>
              <td className="menu">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DancersPage;
