import React, { useState, useEffect } from 'react';
import '../styles/ProfessorsPage.css';
import { FaSearch } from 'react-icons/fa';
import ProfessorDetailModal from '../components/ProfessorDetailModal';
import EditProfessorModal from '../components/EditProfessorModal';
import CalendarProfessorModal from '../components/CalendarProfessorModal';
import PreferenceProfessorModal from '../components/PreferenceProfessorModal';
import ResetProfessorPasswordModal from '../components/ResetProfessorPasswordModal';
import ConfirmationModal from '../components/ConfirmationModal';

const professorsData = [
  {
    id: 201,
    name: 'John Carter',
    email: 'john.carter@example.com',
    subscription: 'Douceur',
    rating: 4.5,
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/40?img=4',
  },
  {
    id: 202,
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    subscription: 'Douceur',
    rating: 4.5,
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/40?img=10',
  },
  {
    id: 203,
    name: 'David Smith',
    email: 'david.smith@example.com',
    subscription: 'Douceur',
    rating: 4.5,
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/40?img=11',
  },
  {
    id: 204,
    name: 'Sophie Duran',
    email: 'sophie.duran@example.com',
    subscription: 'Ginga',
    rating: 3.8,
    status: 'Active',
    avatar: 'https://i.pravatar.cc/40?img=5',
  }
];

const ProfessorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [professors, setProfessors] = useState(professorsData);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [dropdownId, setDropdownId] = useState(null);
  const [openModal, setOpenModal] = useState('');
  const [confirmApprove, setConfirmApprove] = useState(null);

  const handleOptionClick = (type, prof) => {
    setSelectedProfessor(prof);
    setOpenModal(type);
    setDropdownId(null);
  };

  const handleApprove = (prof) => {
    setConfirmApprove(prof);
    setDropdownId(null);
  };

  const confirmApproval = () => {
    setProfessors(prev =>
      prev.map(p =>
        p.id === confirmApprove.id ? { ...p, status: 'Active' } : p
      )
    );
    setConfirmApprove(null);
  };

  const filtered = professors.filter((prof) =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const closeOnClickOutside = (e) => {
      if (!e.target.closest('.dropdown')) {
        setDropdownId(null);
      }
    };
    document.addEventListener('mousedown', closeOnClickOutside);
    return () => document.removeEventListener('mousedown', closeOnClickOutside);
  }, []);

  return (
    <div className="professors-container">
      <div className="header"><h2>Professors</h2></div>

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
      </div>

      <table className="professors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subscription</th>
            <th>Rating</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((prof) => (
            <tr key={prof.id}>
              <td>{prof.id}</td>
              <td className="user-info clickable" onClick={() => handleOptionClick('detail', prof)}>
                <img src={prof.avatar} alt="avatar" /> {prof.name}
              </td>
              <td>{prof.email}</td>
              <td>
                <span className={`badge ${prof.subscription.toLowerCase()}`}>
                  {prof.subscription}
                </span>
              </td>
              <td>{prof.rating}</td>
              <td>{prof.status}</td>
              <td className="menu">
                <div className="dropdown">
                  <span onClick={() => setDropdownId(dropdownId === prof.id ? null : prof.id)}>⋮</span>
                  {dropdownId === prof.id && (
                    <>
                      <div className="dropdown-menu">
                        {prof.status === 'Pending' ? (
                          <div onClick={() => handleApprove(prof)}>✅ Approve</div>
                        ) : (
                          <>
                            <div onClick={() => handleOptionClick('edit', prof)}>✏️ Edit</div>
                            <div onClick={() => handleOptionClick('calendar', prof)}>📅 Calendar</div>
                            <div onClick={() => handleOptionClick('preferences', prof)}>🎯 Preferences</div>
                            <div onClick={() => handleOptionClick('reset', prof)}>🔐 Reset Pass.</div>
                          </>
                        )}
                      </div>
                      <div className="dropdown-overlay"></div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {openModal === 'detail' && <ProfessorDetailModal professor={selectedProfessor} onClose={() => setOpenModal('')} />}
      {openModal === 'edit' && <EditProfessorModal professor={selectedProfessor} onClose={() => setOpenModal('')} />}
      {openModal === 'calendar' && <CalendarProfessorModal professor={selectedProfessor} onClose={() => setOpenModal('')} />}
      {openModal === 'preferences' && <PreferenceProfessorModal professor={selectedProfessor} onClose={() => setOpenModal('')} />}
      {openModal === 'reset' && <ResetProfessorPasswordModal professor={selectedProfessor} onClose={() => setOpenModal('')} />}
      {confirmApprove && (
        <ConfirmationModal
          message={`Are you sure you want to approve ${confirmApprove.name}?`}
          onConfirm={confirmApproval}
          onCancel={() => setConfirmApprove(null)}
        />
      )}
    </div>
  );
};

export default ProfessorsPage;
