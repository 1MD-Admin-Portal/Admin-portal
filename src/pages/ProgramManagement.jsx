import React, { useState } from "react";
import "../styles/ProgramManagement.css";
import { MoreVertical, Plus } from "lucide-react";

const dummyPrograms = [
  {
    id: 1,
    title: "Intro to Hip-Hop",
    host: "Ananya R.",
    level: "Beginner",
    videos: 10,
    status: "Published",
    image: "https://dummyimage.com/48x48/000/fff",
  },
  {
    id: 2,
    title: "Bachata Basics",
    host: "Dev P.",
    level: "Advance",
    videos: 7,
    status: "Draft",
    image: "https://dummyimage.com/48x48/000/fff",
  },
];

const ProgramManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  const filteredPrograms = dummyPrograms.filter((program) => {
    const matchesSearch = program.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? program.status === statusFilter : true;
    const matchesLevel = levelFilter ? program.level === levelFilter : true;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const closeModal = () => setSelectedProgram(null);

  return (
    <div className="program-management-container">
      <div className="program-management-header">
        <h1>Video Programs</h1>
        <div className="program-management-actions">
          <button className="create-program-btn">
            <Plus size={16} /> Create Video Program
          </button>
        </div>
      </div>

      <div className="program-management-filters-bar">
        <div className="filters-left">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Flagged">Flagged</option>
          </select>
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Professional">Professional</option>
            <option value="Advance">Advance</option>
          </select>
        </div>
        <div className="filters-right">
          <input
            type="text"
            placeholder="Search programs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="program-table-wrapper">
        <table className="program-table">
          <thead>
            <tr>
              <th></th>
              <th>Program Title</th>
              <th>Host</th>
              <th>Level</th>
              <th>Videos</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((program) => (
              <tr key={program.id} onClick={() => setSelectedProgram(program)}>
                <td>
                  <input type="checkbox" className="program-checkbox" />
                </td>
                <td>
                  <div className="content-caption">
                    <img src={program.image} alt="Program" className="program-image" />
                    <span>{program.title}</span>
                  </div>
                </td>
                <td>{program.host}</td>
                <td>{program.level}</td>
                <td>{program.videos}</td>
                <td>
                  <span className={`status-label status-${program.status.toLowerCase()}`}>
                    {program.status}
                  </span>
                </td>
                <td className="program-actions"><MoreVertical /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedProgram && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2 className="modal-title">Program Details</h2>
            <div className="modal-info">
              <img src={selectedProgram.image} alt="Program" className="modal-img" />
              <p><strong>Title:</strong> {selectedProgram.title}</p>
              <p><strong>Host:</strong> {selectedProgram.host}</p>
              <p><strong>Level:</strong> {selectedProgram.level}</p>
              <p><strong>Videos:</strong> {selectedProgram.videos}</p>
              <p><strong>Status:</strong> {selectedProgram.status}</p>
            </div>
            <div className="modal-actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramManagement;
