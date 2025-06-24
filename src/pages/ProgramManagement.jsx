// // pages/ProgramManagement.jsx
// import React, { useState } from "react";
// import "../styles/ProgramManagement.css";
// import { MoreVertical, Filter, Plus } from "lucide-react";

// const dummyPrograms = [
//   {
//     id: 1,
//     title: "Intro to Hip-Hop",
//     host: "Ananya R.",
//     level: "Beginner",
//     videos: 10,
//     status: "Published",
//     image: "https://dummyimage.com/48x48/000/fff",
//   },
//   {
//     id: 2,
//     title: "Bachata Basics",
//     host: "Dev P.",
//     level: "Advance",
//     videos: 7,
//     status: "Draft",
//     image: "https://dummyimage.com/48x48/000/fff",
//   },
//   // ... more data
// ];

// const ProgramManagement = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [levelFilter, setLevelFilter] = useState("");

//   const filteredPrograms = dummyPrograms.filter((program) => {
//     const matchesSearch = program.title
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter ? program.status === statusFilter : true;
//     const matchesLevel = levelFilter ? program.level === levelFilter : true;
//     return matchesSearch && matchesStatus && matchesLevel;
//   });

//   return (
//     <div className="program-management">
//       <div className="header-row">
//         <h2>Video Programs</h2>
//         <div className="header-actions">
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <div className="filter-group">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="">All Status</option>
//               <option value="Published">Published</option>
//               <option value="Draft">Draft</option>
//               <option value="Flagged">Flagged</option>
//             </select>
//             <select
//               value={levelFilter}
//               onChange={(e) => setLevelFilter(e.target.value)}
//             >
//               <option value="">All Levels</option>
//               <option value="Beginner">Beginner</option>
//               <option value="Intermediate">Intermediate</option>
//               <option value="Professional">Professional</option>
//               <option value="Advance">Advance</option>
//             </select>
//           </div>
//           <button className="create-button">
//             <Plus size={16} /> Create Video Program
//           </button>
//         </div>
//       </div>

//       <table className="program-table">
//         <thead>
//           <tr>
//             <th></th>
//             <th>Program Title</th>
//             <th>Host</th>
//             <th>Level</th>
//             <th>Videos</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredPrograms.map((program) => (
//             <tr key={program.id}>
//               <td><input type="checkbox" /></td>
//               <td className="program-info">
//                 <img src={program.image} alt="thumbnail" />
//                 <span>{program.title}</span>
//               </td>
//               <td>{program.host}</td>
//               <td>{program.level}</td>
//               <td>{program.videos}</td>
//               <td>
//                 <span className={`status ${program.status.toLowerCase()}`}>
//                   {program.status}
//                 </span>
//               </td>
//               <td><MoreVertical /></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProgramManagement;

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
  // ... more data
];

const ProgramManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const filteredPrograms = dummyPrograms.filter((program) => {
    const matchesSearch = program.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? program.status === statusFilter : true;
    const matchesLevel = levelFilter ? program.level === levelFilter : true;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="program-management-container">
      {/* Header */}
      <div className="program-management-header">
        <h1>Video Programs</h1>
        <div className="program-management-actions">
          <button className="create-program-btn">
            <Plus size={16} /> Create Video Program
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="program-management-filters-bar">
        <div className="filters-left">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Flagged">Flagged</option>
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
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

      {/* Program Table */}
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
              <tr key={program.id}>
                <td>
                  <input type="checkbox" className="program-checkbox" />
                </td>
                <td>
                  <div className="content-caption">
                    <img
                      src={program.image}
                      alt="Program thumbnail"
                      className="program-image"
                    />
                    <span>{program.title}</span>
                  </div>
                </td>
                <td>{program.host}</td>
                <td>{program.level}</td>
                <td>{program.videos}</td>
                <td>
                  <span
                    className={`status-label status-${program.status.toLowerCase()}`}
                  >
                    {program.status}
                  </span>
                </td>
                <td className="program-actions">
                  <MoreVertical />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramManagement;
