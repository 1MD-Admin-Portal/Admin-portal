// AdsManagement.jsx
import React from 'react';
import '../styles/AdsManagement.css';

const adsData = [
  { id: '01', title: 'Summer Bash 2025', type: 'Home Banner', status: 'Active' },
  { id: '02', title: 'New Course Promo', type: 'Feed Ad', status: 'Draft' },
  { id: '03', title: 'Footer Sponsor', type: 'Footer Ad', status: 'Expired' },
];

const AdsManagement = () => {
  return (
    <div className="ads-management-container">
      <h1 className="ads-management-header">Ads Management</h1>

      <button className="create-ad-btn">+ Create New Ad</button>

      <table className="ads-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad Title</th>
            <th>Type</th>
            <th>Ad Image</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adsData.map((ad) => (
            <tr key={ad.id}>
              <td>{ad.id}</td>
              <td>{ad.title}</td>
              <td>{ad.type}</td>
              <td><span className="ads-view-link">View</span></td>
              <td>
                <span className={
                  ad.status === 'Active' ? 'ads-status-active' :
                  ad.status === 'Draft' ? 'ads-status-draft' :
                  'ads-status-expired'
                }>
                  {ad.status}
                </span>
              </td>
              <td className="ads-actions">⋯</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button>{'<'}</button>
        <button className="active">1</button>
        <button>{'>'}</button>
      </div>
    </div>
  );
};

export default AdsManagement;
