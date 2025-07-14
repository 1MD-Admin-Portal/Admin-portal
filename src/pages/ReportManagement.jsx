import React, { useState, useRef, useEffect } from 'react';
import '../styles/ReportManagement.css';

const mockReports = [
  {
    id: 1,
    reportType: 'Class-Related Issue',
    reportedBy: 'jenny@dancer.com',
    dateRaised: '2025-07-06',
    against: 'teacher@hiphop.com',
    contentType: '1-on-1 Class',
    status: 'Pending',
  },
  {
    id: 2,
    reportType: 'Misconduct or Harassment',
    reportedBy: 'leo@dancer.com',
    dateRaised: '2025-07-07',
    against: 'prof.maria@dance.com',
    contentType: 'Group Class',
    status: 'Flagged',
  },
  {
    id: 3,
    reportType: 'Inappropriate Content',
    reportedBy: 'anna@dancer.com',
    dateRaised: '2025-07-05',
    against: 'user99@reels.com',
    contentType: 'Reel Video',
    status: 'Suspended',
  },
  {
    id: 4,
    reportType: 'Cultural Insensitivity',
    reportedBy: 'divya@dancer.com',
    dateRaised: '2025-07-04',
    against: 'mark@fusion.com',
    contentType: 'Tutorial Video',
    status: 'Resolved',
  }
];

const ReportManagement = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action, id) => {
    alert(`${action} action triggered for report ID ${id}`);
    setOpenMenuId(null);
  };

  const filteredReports = mockReports.filter(report =>
  (!statusFilter || report.status === statusFilter) &&
  (!typeFilter || report.reportType === typeFilter) &&
  (!contentTypeFilter || report.contentType === contentTypeFilter) &&
  (!dateFilter || report.dateRaised === dateFilter) &&
  (!searchText ||
    report.reportedBy.toLowerCase().includes(searchText.toLowerCase()) ||
    report.against.toLowerCase().includes(searchText.toLowerCase()))
);


  const stats = {
    total: mockReports.length,
    pending: mockReports.filter(r => r.status === 'Pending').length,
    flagged: mockReports.filter(r => r.status === 'Flagged').length,
    suspended: mockReports.filter(r => r.status === 'Suspended').length,
    resolved: mockReports.filter(r => r.status === 'Resolved').length,
    deleted: mockReports.filter(r => r.status === 'Deleted').length,
  };

  return (
    <div className="report-management-container">
      <h2 className="report-management-title">Report Management</h2>

      {/* KPI Dashboard */}
      <div className="report-kpi-dashboard">
        <div className="kpi-box"><h4>Total Reports</h4><p>{stats.total}</p></div>
        <div className="kpi-box"><h4>Pending</h4><p>{stats.pending}</p></div>
        <div className="kpi-box"><h4>Flagged</h4><p>{stats.flagged}</p></div>
        <div className="kpi-box"><h4>Suspended</h4><p>{stats.suspended}</p></div>
        <div className="kpi-box"><h4>Resolved</h4><p>{stats.resolved}</p></div>
        <div className="kpi-box"><h4>Deleted</h4><p>{stats.deleted}</p></div>
      </div>

      {/* Filters & Search */}
<div className="report-management-filters">
  <input
    type="text"
    placeholder="Search by Reporter or Against"
    value={searchText}
    onChange={e => setSearchText(e.target.value)}
  />

  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
    <option value="">Report Type</option>
    <option value="Class-Related Issue">Class-Related Issue</option>
    <option value="Misconduct or Harassment">Misconduct or Harassment</option>
    <option value="Inappropriate Content">Inappropriate Content</option>
    <option value="Cultural Insensitivity">Cultural Insensitivity</option>
    <option value="Authenticity & Fairness">Authenticity & Fairness</option>
  </select>

  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
    <option value="">Status</option>
    <option value="Pending">Pending</option>
    <option value="Flagged">Flagged</option>
    <option value="Suspended">Suspended</option>
    <option value="Resolved">Resolved</option>
    <option value="Deleted">Deleted</option>
  </select>

  <select value={contentTypeFilter} onChange={e => setContentTypeFilter(e.target.value)}>
    <option value="">Content Type</option>
    <option value="1-on-1 Class">1-on-1 Class</option>
    <option value="Group Class">Group Class</option>
    <option value="Reel Video">Reel Video</option>
    <option value="Tutorial Video">Tutorial Video</option>
  </select>

  <input
    type="date"
    value={dateFilter}
    onChange={e => setDateFilter(e.target.value)}
  />

  <button className="reset-button" onClick={() => {
    setSearchText('');
    setStatusFilter('');
    setTypeFilter('');
    setContentTypeFilter('');
    setDateFilter('');
  }}>
    Reset Filters
  </button>
</div>


      {/* Table */}
      <table className="report-management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Report Type</th>
            <th>Reported By</th>
            <th>Date Raised</th>
            <th>Against</th>
            <th>Content Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report, index) => {
            const isLastTwo = index >= filteredReports.length - 2;
            return (
              <tr key={report.id}>
                <td>{report.id.toString().padStart(2, '0')}</td>
                <td>{report.reportType}</td>
                <td>{report.reportedBy}</td>
                <td>{report.dateRaised}</td>
                <td>{report.against}</td>
                <td>{report.contentType}</td>
                <td>{report.status}</td>
                <td className="actions-cell" ref={dropdownRef}>
                  <button
                    className="dots-button"
                    onClick={() =>
                      setOpenMenuId(openMenuId === report.id ? null : report.id)
                    }
                  >
                    ⋮
                  </button>
                  {openMenuId === report.id && (
                    <div className={`dropdown-menu ${isLastTwo ? 'open-up' : ''}`}>
                      <div onClick={() => handleAction('Flag', report.id)}>⚠️ Flag</div>
                      <div onClick={() => handleAction('Suspend', report.id)}>⛔ Suspend</div>
                      <div onClick={() => handleAction('Delete', report.id)}>❌ Delete</div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          {filteredReports.length === 0 && (
            <tr className="report-management-empty">
              <td colSpan="8">No reports match the selected filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportManagement;
