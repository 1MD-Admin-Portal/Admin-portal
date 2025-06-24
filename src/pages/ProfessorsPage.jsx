import React, { useState } from 'react';
import '../styles/ProfessorsPage.css';
import { FaSearch } from 'react-icons/fa';

const professors = [
  {
    id: 201,
    name: 'John Carter',
    email: 'john.carter@example.com',
    subscription: 'Douceur',
    rating: 4.5,
    status: 'Active',
    avatar: 'https://i.pravatar.cc/40?img=4',
  },
  {
    id: 202,
    name: 'Sophie Duran',
    email: 'sophie.duran@example.com',
    subscription: 'Ginga',
    rating: 3.8,
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/40?img=5',
  },
  {
    id: 203,
    name: 'Carlos Mendez',
    email: 'carlos.m@example.com',
    subscription: 'Fiver',
    rating: 4.9,
    status: 'Active',
    avatar: 'https://i.pravatar.cc/40?img=6',
  },
];

const ProfessorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProfessors = professors.filter((prof) => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubscription = !subscriptionFilter || prof.subscription === subscriptionFilter;
    const matchesStatus = !statusFilter || prof.status === statusFilter;

    const ratingValue = parseFloat(prof.rating);
    let matchesRating = true;

    if (ratingFilter === '5') {
      matchesRating = ratingValue >= 5;
    } else if (ratingFilter === '4') {
      matchesRating = ratingValue >= 4;
    } else if (ratingFilter === '3') {
      matchesRating = ratingValue >= 3;
    } else if (ratingFilter === '2') {
      matchesRating = ratingValue >= 2;
    }

    return matchesSearch && matchesSubscription && matchesStatus && matchesRating;
  });

  return (
    <div className="professors-container">
      <div className="header">
        <h2>Professors</h2>
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

          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
            <option value="">All Ratings</option>
            <option value="5">5</option>
            <option value="4">4+</option>
            <option value="3">3+</option>
            <option value="2">2+</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <table className="professors-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subscription</th>
            <th>Rating</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredProfessors.map((prof) => (
            <tr key={prof.id}>
              <td>{prof.id}</td>
              <td className="user-info">
                <img src={prof.avatar} alt="avatar" />
                {prof.name}
              </td>
              <td>{prof.email}</td>
              <td>
                <span className={`badge ${prof.subscription.toLowerCase()}`}>
                  {prof.subscription}
                </span>
              </td>
              <td>{prof.rating.toFixed(1)}</td>
              <td>{prof.status}</td>
              <td className="menu">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessorsPage;
