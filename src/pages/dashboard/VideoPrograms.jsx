// import React, { useState, useEffect } from "react";
// import "../../styles/VideoPrograms.css";
// import CreateProgramModal from "./CreateProgramModal";
// import { X } from "lucide-react";
// import { getProgramsService } from "../../services/program.service";

// const VideoPrograms = () => {
//   const [programs, setPrograms] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [levelFilter, setLevelFilter] = useState("");
//   const [videoFilter, setVideoFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [action, setAction] = useState(null);
//   const [reason, setReason] = useState("");

//   useEffect(() => {
//     const loadPrograms = async () => {
//       const data = await getProgramsService();
//       setPrograms(data);
//     };
//     loadPrograms();
//   }, []);

//   const filterVideos = (prog) => {
//     const matchesSearch = prog.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesLevel = !levelFilter || prog.dance_level === levelFilter;
//     const matchesStatus = !statusFilter || prog.status === statusFilter;
//     const videoCount = prog.videos.length;
//     const matchesVideoCount = (() => {
//       switch (videoFilter) {
//         case "0":
//           return videoCount === 0;
//         case "1-10":
//           return videoCount > 0 && videoCount <= 10;
//         case "10-30":
//           return videoCount > 10 && videoCount <= 30;
//         case "30-50":
//           return videoCount > 30 && videoCount <= 50;
//         case "50-100":
//           return videoCount > 50 && videoCount <= 100;
//         case "100+":
//           return videoCount > 100;
//         default:
//           return true;
//       }
//     })();
//     return matchesSearch && matchesLevel && matchesStatus && matchesVideoCount;
//   };

//   const filteredPrograms = programs.filter(filterVideos);

//   return (
//     <div className="video-programs-page">
//       {/* header and filters */}
//       <div className="header">
//         <h1>Video Programs Management</h1>
//         <button
//           className="create-video-btn"
//           onClick={() => setIsModalOpen(true)}
//         >
//           + Create Video Program
//         </button>
//       </div>
//       <div className="filter-bar">
//         <input
//           type="text"
//           placeholder="Search"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <select
//           onChange={(e) => setLevelFilter(e.target.value)}
//           defaultValue=""
//         >
//           <option value="">All Levels</option>
//           <option value="Beginner">Beginner</option>
//           <option value="Intermediate">Intermediate</option>
//           <option value="Advance">Advance</option>
//           <option value="Professional">Professional</option>
//         </select>
//         <select
//           onChange={(e) => setVideoFilter(e.target.value)}
//           defaultValue=""
//         >
//           <option value="">All Videos</option>
//           <option value="0">0</option>
//           <option value="1-10">1 - 10</option>
//           <option value="10-30">10 - 30</option>
//           <option value="30-50">30 - 50</option>
//           <option value="50-100">50 - 100</option>
//           <option value="100+">100+</option>
//         </select>
//         <select
//           onChange={(e) => setStatusFilter(e.target.value)}
//           defaultValue=""
//         >
//           <option value="">All Status</option>
//           <option value="Published">Published</option>
//           <option value="Draft">Draft</option>
//           <option value="Flagged">Flagged</option>
//         </select>
//       </div>
//       {/* table */}
//       <div className="video-programs-table">
//         <table>
//           <thead>
//             <tr>
//               <th></th>
//               <th>Program Title</th>
//               <th>Host</th>
//               <th>Level</th>
//               <th>Videos</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredPrograms.map((prog) => (
//               <tr
//                 key={prog.program_id}
//                 onClick={() => setSelectedProgram(prog)}
//                 className="clickable-row"
//               >
//                 <td>
//                   <input type="checkbox" />
//                 </td>
//                 <td className="program-title">
//                   <img src="https://via.placeholder.com/40" alt="thumbnail" />
//                   {prog.title}
//                 </td>
//                 <td>{prog.instructor_name}</td>
//                 <td>{prog.dance_level}</td>
//                 <td>{prog.videos.length}</td>
//                 <td>
//                   <span
//                     className={`status ${
//                       prog.status?.toLowerCase() || "published"
//                     }`}
//                   >
//                     Published
//                   </span>
//                 </td>
//               </tr>
//             ))}
//             {filteredPrograms.length === 0 && (
//               <tr>
//                 <td colSpan="6" style={{ textAlign: "center" }}>
//                   No programs found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       {/* create modal */}
//       <CreateProgramModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         instructorOptions={["Ananya R."]}
//         danceStyles={["Salsa", "Hip-Hop", "Bachata", "Contemporary"]}
//       />

//       {/* view modal */}
//       {selectedProgram && (
//         <div
//           className="video-popup-overlay"
//           onClick={() => {
//             setSelectedProgram(null);
//             setAction(null);
//             setReason("");
//           }}
//         >
//           <div
//             className="video-popup-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="popup-header">
//               <h2>{selectedProgram.title}</h2>
//               <X
//                 className="popup-close"
//                 onClick={() => {
//                   setSelectedProgram(null);
//                   setAction(null);
//                   setReason("");
//                 }}
//               />
//             </div>
//             <img src="https://via.placeholder.com/300" alt="cover" />
//             <p>
//               <strong>Host:</strong> {selectedProgram.instructor_name}
//             </p>
//             <p>
//               <strong>Level:</strong> {selectedProgram.dance_level}
//             </p>
//             <p>
//               <strong>Status:</strong> Published
//             </p>
//             <p>
//               <strong>Videos:</strong>
//             </p>
//             <ul>
//               {selectedProgram.videos.map((video) => (
//                 <li key={video.id}>
//                   {video.title} ({video.duration})
//                 </li>
//               ))}
//             </ul>

//             <div className="program-actions">
//               <button
//                 className="danger-btn"
//                 onClick={() => setAction("Delete")}
//               >
//                 Delete
//               </button>
//               <button
//                 className="warning-btn"
//                 onClick={() => setAction("Retire")}
//               >
//                 Retire
//               </button>
//               <button className="pause-btn" onClick={() => setAction("Pause")}>
//                 Pause
//               </button>
//             </div>

//             {action && (
//               <div className="reason-form">
//                 <p>
//                   <strong>{action} Reason:</strong>
//                 </p>
//                 <textarea
//                   placeholder={`Why do you want to ${action.toLowerCase()} this program?`}
//                   value={reason}
//                   onChange={(e) => setReason(e.target.value)}
//                 />
//                 <button
//                   className="submit-reason"
//                   onClick={() => {
//                     console.log(
//                       `${action} program ${selectedProgram.title} for reason: ${reason}`
//                     );
//                     // Handle API or state update here
//                     setSelectedProgram(null);
//                     setAction(null);
//                     setReason("");
//                   }}
//                   disabled={!reason.trim()}
//                 >
//                   Submit
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoPrograms;
import React, { useState, useEffect } from "react";
import "../../styles/VideoPrograms.css";
import CreateProgramModal from "./CreateProgramModal";
import { X } from "lucide-react";
import { getProgramsService } from "../../services/program.service";

const VideoPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [videoFilter, setVideoFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const res = await getProgramsService();
        console.log("Loaded programs response:", res);
        if (Array.isArray(res)) {
          setPrograms(res);
        } else if (res && Array.isArray(res.programs)) {
          setPrograms(res.programs);
        } else {
          setPrograms([]); // fallback
        }
      } catch (e) {
        console.error("Failed to load programs", e);
      }
    };
    loadPrograms();
  }, []);

  const filterVideos = (prog) => {
    const matchesSearch = prog.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel = !levelFilter || prog.dance_level === levelFilter;
    const matchesStatus = !statusFilter || prog.status === statusFilter;
    const videoCount = prog.videos.length;
    const matchesVideoCount = (() => {
      switch (videoFilter) {
        case "0":
          return videoCount === 0;
        case "1-10":
          return videoCount > 0 && videoCount <= 10;
        case "10-30":
          return videoCount > 10 && videoCount <= 30;
        case "30-50":
          return videoCount > 30 && videoCount <= 50;
        case "50-100":
          return videoCount > 50 && videoCount <= 100;
        case "100+":
          return videoCount > 100;
        default:
          return true;
      }
    })();
    return matchesSearch && matchesLevel && matchesStatus && matchesVideoCount;
  };

  const filteredPrograms = programs.filter(filterVideos);

  return (
    <div className="video-programs-page">
      {/* header and filters */}
      <div className="header">
        <h1>Video Programs Management</h1>
        <button
          className="create-video-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Video Program
        </button>
      </div>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          onChange={(e) => setLevelFilter(e.target.value)}
          defaultValue=""
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advance">Advance</option>
          <option value="Professional">Professional</option>
        </select>
        <select
          onChange={(e) => setVideoFilter(e.target.value)}
          defaultValue=""
        >
          <option value="">All Videos</option>
          <option value="0">0</option>
          <option value="1-10">1 - 10</option>
          <option value="10-30">10 - 30</option>
          <option value="30-50">30 - 50</option>
          <option value="50-100">50 - 100</option>
          <option value="100+">100+</option>
        </select>
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          defaultValue=""
        >
          <option value="">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Flagged">Flagged</option>
        </select>
      </div>
      {/* table */}
      <div className="video-programs-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Program Title</th>
              <th>Host</th>
              <th>Level</th>
              <th>Videos</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((prog) => (
              <tr
                key={prog.program_id}
                onClick={() => setSelectedProgram(prog)}
                className="clickable-row"
              >
                <td>
                  <input type="checkbox" />
                </td>
                <td className="program-title">
                  <img
                    src={
                      prog.image_url ||
                      "https://via.placeholder.com/40?text=No+Image"
                    }
                    alt="thumbnail"
                    width="40"
                    height="40"
                  />
                  {prog.title}
                </td>
                <td>
                  {prog.instructor_name || `Instructor #${prog.instructor_id}`}
                </td>
                <td>{prog.dance_level}</td>
                <td>{prog.videos.length}</td>
                <td>
                  <span
                    className={`status ${
                      prog.status?.toLowerCase() || "published"
                    }`}
                  >
                    Published
                  </span>
                </td>
              </tr>
            ))}
            {filteredPrograms.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No programs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* create modal */}
      <CreateProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instructorOptions={[{ id: 1, name: "Ananya R." }]}
        danceStyles={["Salsa", "Hip-Hop", "Bachata", "Contemporary"]}
      />

      {/* view modal */}
      {selectedProgram && (
        <div
          className="video-popup-overlay"
          onClick={() => {
            setSelectedProgram(null);
            setAction(null);
            setReason("");
          }}
        >
          <div
            className="video-popup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h2>{selectedProgram.title}</h2>
              <X
                className="popup-close"
                onClick={() => {
                  setSelectedProgram(null);
                  setAction(null);
                  setReason("");
                }}
              />
            </div>
            <img
              src={
                selectedProgram.image_url ||
                "https://via.placeholder.com/300?text=No+Image"
              }
              alt="cover"
              style={{ width: "100%", height: "auto", marginBottom: "1rem" }}
            />
            <p>
              <strong>Host:</strong>{" "}
              {selectedProgram.instructor_name ||
                `Instructor #${selectedProgram.instructor_id}`}
            </p>
            <p>
              <strong>Level:</strong> {selectedProgram.dance_level}
            </p>
            <p>
              <strong>Status:</strong> Published
            </p>
            <p>
              <strong>Videos:</strong>
            </p>
            <ul>
              {selectedProgram.videos.map((video) => (
                <li key={video.id}>
                  {video.title} ({video.duration})<br />
                  <a href={video.video_url} target="_blank" rel="noreferrer">
                    Watch Video
                  </a>
                </li>
              ))}
            </ul>

            <div className="program-actions">
              <button
                className="danger-btn"
                onClick={() => setAction("Delete")}
              >
                Delete
              </button>
              <button
                className="warning-btn"
                onClick={() => setAction("Retire")}
              >
                Retire
              </button>
              <button className="pause-btn" onClick={() => setAction("Pause")}>
                Pause
              </button>
            </div>

            {action && (
              <div className="reason-form">
                <p>
                  <strong>{action} Reason:</strong>
                </p>
                <textarea
                  placeholder={`Why do you want to ${action.toLowerCase()} this program?`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <button
                  className="submit-reason"
                  onClick={() => {
                    console.log(
                      `${action} program ${selectedProgram.title} for reason: ${reason}`
                    );
                    setSelectedProgram(null);
                    setAction(null);
                    setReason("");
                  }}
                  disabled={!reason.trim()}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPrograms;
