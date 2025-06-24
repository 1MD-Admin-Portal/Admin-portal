import React, { useState } from 'react';
import '../styles/AccessLogs.css';

const mockLogs = [
  { id: 1, name: 'Jane Admin', email: 'jane@admin.com', role: 'Professor', action: 'Login Success', timestamp: '2025-05-19 10:02AM' },
  { id: 2, name: 'Mike Dancer', email: 'mike@dance.com', role: 'Dancer', action: 'Profile Updated', timestamp: '2025-05-19 10:04AM' },
  { id: 3, name: 'Lara Coach', email: 'lara@coach.com', role: 'Organizer', action: 'Approved 1on-1 Class', timestamp: '2025-05-19 10:06AM' },
  { id: 4, name: 'John Admin', email: 'john@admin.com', role: 'DJ', action: 'Suspended User', timestamp: '2025-05-19 10:10AM' },
  { id: 5, name: 'Lara Coach', email: 'lara@coach.com', role: 'Professor', action: 'Logout', timestamp: '2025-05-19 10:12AM' }
];

const AccessLogs = () => {
  const [userType, setUserType] = useState('');
  const [actionType, setActionType] = useState('');
  const [date, setDate] = useState('');

  const filteredLogs = mockLogs.filter(log => {
    return (
      (!userType || log.role === userType) &&
      (!actionType || log.action === actionType) &&
      (!date || log.timestamp.startsWith(date))
    );
  });

  return (
    <div className="access-logs-container">
      <h2 className="access-logs-title">Access Logs</h2>

      <div className="access-logs-filters">
        <select value={userType} onChange={e => setUserType(e.target.value)}>
          <option value="">User Type</option>
          <option value="Dancer">Dancer</option>
          <option value="Professor">Professor</option>
          <option value="Organizer">Organizer</option>
          <option value="DJ">DJ</option>
        </select>

        <select value={actionType} onChange={e => setActionType(e.target.value)}>
          <option value="">Action Type</option>
          <option value="Login Success">Login Success</option>
          <option value="Profile Updated">Profile Updated</option>
          <option value="Approved 1on-1 Class">Approved 1on-1 Class</option>
          <option value="Suspended User">Suspended User</option>
          <option value="Logout">Logout</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <table className="access-logs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map(log => (
            <tr key={log.id}>
              <td>{log.id.toString().padStart(2, '0')}</td>
              <td>{log.name}</td>
              <td>{log.email}</td>
              <td>{log.role}</td>
              <td>{log.action}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
          {filteredLogs.length === 0 && (
            <tr className="access-logs-empty">
              <td colSpan="6">No logs match the selected filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccessLogs;
