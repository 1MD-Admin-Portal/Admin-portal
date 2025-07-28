// import React, { useState, useEffect, useRef } from "react";
// import "../styles/ProfessorsPage.css";
// import { FaSearch } from "react-icons/fa";
// import ProfessorDetailModal from "../components/ProfessorDetailModal";
// import EditProfessorModal from "../components/EditProfessorModal";
// import CalendarProfessorModal from "../components/CalendarProfessorModal";
// import PreferenceProfessorModal from "../components/PreferenceProfessorModal";
// import ResetProfessorPasswordModal from "../components/ResetProfessorPasswordModal";
// import ConfirmationModal from "../components/ConfirmationModal";
// import {
//   approveInstructorApplication,
//   rejectInstructorApplication,
// } from "../services/professor.service";

// const professorsData = [
//   {
//     id: 201,
//     name: "John Carter",
//     email: "john.carter@example.com",
//     subscription: "Fiver",
//     rating: 4.5,
//     status: "Pending",
//     avatar: "https://i.pravatar.cc/40?img=4",
//     followers: 1200,
//     referrals: 45,
//     classes: [
//       { title: "Music Theory", date: "2025-07-23" },
//       { title: "Rhythm Training", date: "2025-07-26" },
//       { title: "Live Jam Session", date: "2025-07-30" },
//     ],
//   },
//   {
//     id: 202,
//     name: "Michael Johnson",
//     email: "michael.j@example.com",
//     subscription: "Douceur",
//     rating: 4.5,
//     status: "Pending",
//     avatar: "https://i.pravatar.cc/40?img=10",
//     followers: 300,
//     referrals: 20,
//     classes: [
//       { title: "Music Theory", date: "2025-07-24" },
//       { title: "Rhythm Training", date: "2025-07-25" },
//       { title: "Live Jam Session", date: "2025-07-31" },
//     ],
//   },
//   {
//     id: 203,
//     name: "David Smith",
//     email: "david.smith@example.com",
//     subscription: "Douceur",
//     rating: 4.5,
//     status: "Pending",
//     avatar: "https://i.pravatar.cc/40?img=11",
//     followers: 5100,
//     referrals: 99,
//     classes: [
//       { title: "Music Theory", date: "2025-07-22" },
//       { title: "Rhythm Training", date: "2025-07-27" },
//       { title: "Live Jam Session", date: "2025-07-28" },
//     ],
//   },
//   {
//     id: 204,
//     name: "Sophie Duran",
//     email: "sophie.duran@example.com",
//     subscription: "Ginga",
//     rating: 3.8,
//     status: "Active",
//     avatar: "https://i.pravatar.cc/40?img=5",
//     followers: 80,
//     referrals: 2,
//     classes: [
//       { title: "Music Theory", date: "2025-07-20" },
//       { title: "Rhythm Training", date: "2025-07-18" },
//       { title: "Live Jam Session", date: "2025-08-01" },
//     ],
//   },
//   {
//     id: 205,
//     name: "Mia Williams",
//     email: "mia@example.com",
//     subscription: "Ginga",
//     rating: 4.9,
//     status: "Active",
//     avatar: "https://i.pravatar.cc/40?img=5",
//     followers: 26000,
//     referrals: 180,
//     classes: [
//       { title: "Music Theory", date: "2025-08-23" },
//       { title: "Rhythm Training", date: "2025-08-26" },
//       { title: "Live Jam Session", date: "2025-08-30" },
//     ],
//   },
// ];

// const ProfessorsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [professors, setProfessors] = useState(professorsData);
//   const [selectedProfessor, setSelectedProfessor] = useState(null);
//   const [dropdownId, setDropdownId] = useState(null);
//   const [openModal, setOpenModal] = useState("");
//   const [confirmApprove, setConfirmApprove] = useState(null);
//   const dropdownRef = useRef(null);
//   const [subscriptionFilter, setSubscriptionFilter] = useState("");
//   const [ratingFilter, setRatingFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [referralFilter, setReferralFilter] = useState("");
//   const [followersFilter, setFollowersFilter] = useState("");
//   const [badgeFilter, setBadgeFilter] = useState("");
//   const [rejectingProfessor, setRejectingProfessor] = useState(null);
//   const [rejectComment, setRejectComment] = useState("");

//   const handleOptionClick = (type, prof) => {
//     setSelectedProfessor(prof);
//     setOpenModal(type);
//     setDropdownId(null);
//   };

//   const getProfessorBadge = (followers) => {
//     if (followers >= 25000) return "🏆 Hombre de la Pista";
//     if (followers >= 5000) return "👑 Sensual King/Queen";
//     if (followers >= 2500) return "🌿 Succulent o Vibe";
//     if (followers >= 1000) return "🎨 Artist";
//     if (followers >= 500) return "🎭 Performer";
//     if (followers >= 200) return "👨‍🏫 Instructor";
//     return "🎓 Professor";
//   };

//   const handleApprove = (prof) => {
//     setDropdownId(null); // close dropdown first
//     setTimeout(() => setConfirmApprove(prof), 0); // delay to prevent dropdown closing interference
//   };
//   const handleReject = (prof) => {
//     console.log("Reject clicked for:", prof.name);
//     setDropdownId(null);
//     setTimeout(() => setRejectingProfessor(prof), 0);
//   };

//   const confirmApproval = async () => {
//     console.log("confirmApprove state:", confirmApprove);
//     if (!confirmApprove || !confirmApprove.id) {
//       console.log("No professor selected for approval");
//       return;
//     }

//     try {
//       const res = await approveInstructorApplication(confirmApprove.id);
//       console.log("Approved successfully:", res);
//       setProfessors((prev) =>
//         prev.map((p) =>
//           p.id === confirmApprove.id ? { ...p, status: "Active" } : p
//         )
//       );
//       setConfirmApprove(null);
//       console.log(`🔄 Updated status to Active for ID ${confirmApprove.id}`);
//     } catch (error) {
//       console.error("❌ Error approving instructor:", error);
//       alert("Failed to approve instructor. Please try again.");
//     }
//   };

//   const handleRejectSubmit = async () => {
//     try {
//       console.log("🚫 Sending reject request with:", {
//         id: rejectingProfessor.id,
//         comment: rejectComment,
//       });
//       await rejectInstructorApplication(rejectingProfessor.id, rejectComment);

//       console.log("✅ Rejection successful");
//       setProfessors((prev) =>
//         prev.filter((p) => p.id !== rejectingProfessor.id)
//       );
//     } catch (err) {
//       console.error("❌ Rejection failed:", err);
//       alert("Failed to reject instructor. Please try again.");
//     } finally {
//       setRejectingProfessor(null);
//       setRejectComment("");
//     }
//   };

//   const filtered = professors.filter((prof) => {
//     const badge = getProfessorBadge(prof.followers);
//     return (
//       prof.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (subscriptionFilter === "" || prof.subscription === subscriptionFilter) &&
//       (statusFilter === "" || prof.status === statusFilter) &&
//       (ratingFilter === "" || prof.rating >= parseFloat(ratingFilter)) &&
//       (referralFilter === "" || prof.referrals >= parseInt(referralFilter)) &&
//       (followersFilter === "" || prof.followers >= parseInt(followersFilter)) &&
//       (badgeFilter === "" || badge === badgeFilter)
//     );
//   });

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       const isDropdownTrigger = e.target.closest(".dropdown span");
//       const isDropdownMenu = e.target.closest(".dropdown-menu");

//       if (!isDropdownTrigger && !isDropdownMenu) {
//         setDropdownId(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="professors-container">
//       <div className="header">
//         <h2>Professors</h2>
//       </div>

//       <div className="top-controls">
//         <div className="search-box">
//           <FaSearch className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>
//       <div className="filters-group">
//         <select
//           value={subscriptionFilter}
//           onChange={(e) => setSubscriptionFilter(e.target.value)}
//         >
//           <option value="">All Subscriptions</option>
//           <option value="Douceur">Douceur</option>
//           <option value="Ginga">Ginga</option>
//           <option value="Fiver">Fiver</option>
//         </select>

//         <select
//           value={ratingFilter}
//           onChange={(e) => setRatingFilter(e.target.value)}
//         >
//           <option value="">All Ratings</option>
//           <option value="5">5</option>
//           <option value="4.5">4.5</option>
//           <option value="4">4+</option>
//           <option value="3.5">3.5+</option>
//         </select>

//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="Active">Active</option>
//           <option value="Pending">Pending</option>
//         </select>

//         <select
//           value={badgeFilter}
//           onChange={(e) => setBadgeFilter(e.target.value)}
//         >
//           <option value="">All Badges</option>
//           <option value="🎓 Professor">Professor</option>
//           <option value="👨‍🏫 Instructor">Instructor</option>
//           <option value="🎭 Performer">Performer</option>
//           <option value="🎨 Artist">Artist</option>
//           <option value="🌿 Succulent o Vibe">Succulent o Vibe</option>
//           <option value="👑 Sensual King/Queen">Sensual King/Queen</option>
//           <option value="🏆 Hombre de la Pista">Hombre de la Pista</option>
//         </select>
//       </div>

//       <div className="professors-table-container">
//         <table className="professors-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Rating</th>
//               <th>Followers</th>
//               <th>Referrals</th>
//               <th>Subscription</th>
//               <th>Status</th>
//               <th>Badge</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((prof, index) => {
//               const isLastThree = index >= filtered.length - 3;
//               const badge = getProfessorBadge(prof.followers);

//               return (
//                 <tr key={prof.id}>
//                   <td>{prof.id}</td>
//                   <td
//                     className="user-info clickable"
//                     onClick={() => handleOptionClick("detail", prof)}
//                   >
//                     <img src={prof.avatar} alt="avatar" /> {prof.name}
//                   </td>
//                   <td>{prof.email}</td>
//                   <td>{prof.rating}</td>
//                   <td>{prof.followers}</td>
//                   <td>{prof.referrals}</td>
//                   <td>
//                     <span
//                       className={`badge ${prof.subscription.toLowerCase()}`}
//                     >
//                       {prof.subscription}
//                     </span>
//                   </td>
//                   <td>{prof.status}</td>

//                   <td>
//                     <span className="badge-display">{badge}</span>
//                   </td>
//                   <td className="menu">
//                     <div className="dropdown" ref={dropdownRef}>
//                       <span
//                         onClick={() =>
//                           setDropdownId(dropdownId === prof.id ? null : prof.id)
//                         }
//                       >
//                         ⋮
//                       </span>
//                       {dropdownId === prof.id && (
//                         <>
//                           <div
//                             className={`dropdown-menu ${
//                               isLastThree ? "upwards" : ""
//                             }`}
//                           >
//                             {prof.status === "Pending" ? (
//                               <>
//                                 <div onClick={() => handleApprove(prof)}>
//                                   ✅ Approve
//                                 </div>
//                                 <div onClick={() => handleReject(prof)}>
//                                   ❌ Reject
//                                 </div>
//                               </>
//                             ) : (
//                               <>
//                                 <div
//                                   onClick={() =>
//                                     handleOptionClick("calendar", prof)
//                                   }
//                                 >
//                                   📅 Calendar
//                                 </div>
//                                 <div
//                                   onClick={() =>
//                                     handleOptionClick("preferences", prof)
//                                   }
//                                 >
//                                   🎯 Preferences
//                                 </div>
//                                 <div
//                                   onClick={() =>
//                                     handleOptionClick("reset", prof)
//                                   }
//                                 >
//                                   🔐 Reset Pass.
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                           <div className="dropdown-overlay"></div>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Modals */}
//       {openModal === "detail" && (
//         <ProfessorDetailModal
//           professor={selectedProfessor}
//           onClose={() => setOpenModal("")}
//         />
//       )}
//       {openModal === "edit" && (
//         <EditProfessorModal
//           professor={selectedProfessor}
//           onClose={() => setOpenModal("")}
//         />
//       )}
//       {openModal === "calendar" && (
//         <CalendarProfessorModal
//           professor={selectedProfessor}
//           onClose={() => setOpenModal("")}
//         />
//       )}
//       {openModal === "preferences" && (
//         <PreferenceProfessorModal
//           professor={selectedProfessor}
//           onClose={() => setOpenModal("")}
//         />
//       )}
//       {openModal === "reset" && (
//         <ResetProfessorPasswordModal
//           professor={selectedProfessor}
//           onClose={() => setOpenModal("")}
//         />
//       )}
//       {confirmApprove && (
//         <ConfirmationModal
//           message={`Are you sure you want to approve ${confirmApprove.name}?`}
//           onConfirm={confirmApproval}
//           onCancel={() => setConfirmApprove(null)}
//         />
//       )}

//       {rejectingProfessor && (
//         <ConfirmationModal
//           message={
//             <>
//               <p>
//                 Why are you rejecting <strong>{rejectingProfessor.name}</strong>
//                 ?
//               </p>
//               <textarea
//                 placeholder="Enter reason..."
//                 value={rejectComment}
//                 onChange={(e) => setRejectComment(e.target.value)}
//                 style={{ width: "100%", height: "80px", marginTop: "10px" }}
//               />
//             </>
//           }
//           onConfirm={handleRejectSubmit}
//           onCancel={() => {
//             setRejectingProfessor(null);
//             setRejectComment("");
//           }}
//           confirmLabel="Reject"
//         />
//       )}
//     </div>
//   );
// };

// export default ProfessorsPage;
import React, { useEffect, useState } from "react";
import {
  approveInstructorApplication,
  getInstructorApplications,
  rejectInstructorApplication,
} from "../services/professor.service";
import "../styles/ProfessorsPage.css";

const ProfessorsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [activeTab, setActiveTab] = useState("applications");

  const allProfessors = [
    { id: 1, name: "Prof. John Doe", email: "john@example.com" },
    { id: 2, name: "Prof. Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Prof. Alice Brown", email: "alice@example.com" },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getInstructorApplications();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching instructor applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleApprove = async (applicationId) => {
    try {
      await approveInstructorApplication(applicationId);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: "approved" } : app
        )
      );
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectInstructorApplication(selectedRejectId, rejectComment);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedRejectId
            ? { ...app, status: "rejected", comment: rejectComment }
            : app
        )
      );
      setSelectedRejectId(null);
      setRejectComment("");
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const formatField = (field) => {
    if (Array.isArray(field)) return field.join(", ");
    if (typeof field === "string" && field.startsWith("[")) {
      try {
        return JSON.parse(field).join(", ");
      } catch {
        return field;
      }
    }
    return field;
  };

  if (loading) {
    return <div className="professors-container">Loading...</div>;
  }

  return (
    <div className="professors-container">
      <h1 className="professors-title">Professors</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "applications" ? "active-tab" : ""}
          onClick={() => setActiveTab("applications")}
        >
          Professor Applications
        </button>
        <button
          className={activeTab === "list" ? "active-tab" : ""}
          onClick={() => setActiveTab("list")}
        >
          All Professors List
        </button>
      </div>

      {/* Tab 1: Applications */}
      {activeTab === "applications" && (
        <table className="professors-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Dance Styles</th>
              <th>Availability</th>
              <th>Goal</th>
              <th>Experience</th>
              <th>Document</th>
              <th>Status</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.email}</td>
                <td>{formatField(app.dance_style)}</td>
                <td>{formatField(app.availability)}</td>
                <td>{app.goal}</td>
                <td>{app.experience}</td>
                <td>
                  {app.document_url ? (
                    <a
                      href={app.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      View
                    </a>
                  ) : (
                    "No document"
                  )}
                </td>
                <td>{app.status}</td>
                <td>{app.comment || "-"}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-button approve-btn"
                      onClick={() => handleApprove(app.id)}
                      disabled={app.status !== "pending"}
                    >
                      Approve
                    </button>
                    <button
                      className="action-button reject-btn"
                      onClick={() => setSelectedRejectId(app.id)}
                      disabled={app.status !== "pending"}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Tab 2: All Professors List */}
      {activeTab === "list" && (
        <table className="professors-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {allProfessors.map((prof) => (
              <tr key={prof.id}>
                <td>{prof.id}</td>
                <td>{prof.name}</td>
                <td>{prof.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Reject Modal */}
      {selectedRejectId && (
        <div className="reject-modal">
          <h2>Reject Application</h2>
          <textarea
            rows="4"
            placeholder="Add a comment (required)"
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
          />
          <div className="modal-button-group">
            <button
              onClick={handleReject}
              className="modal-btn submit-reject-btn"
              disabled={!rejectComment.trim()}
            >
              Submit Rejection
            </button>
            <button
              onClick={() => {
                setSelectedRejectId(null);
                setRejectComment("");
              }}
              className="modal-btn cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorsPage;
