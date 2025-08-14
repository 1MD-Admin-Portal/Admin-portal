import React, { useState, useRef, useEffect } from "react";
import "../styles/ClassModeration.css";
import { X } from "lucide-react";
import {
  getPendingClassesService,
  getAllClassesService,
  getClassDetailService,
  approveClassService,
  rejectClassService,
} from "../services/class.service";

const ClassModeration = () => {
  const [tab, setTab] = useState("pending"); // 'pending' or 'ongoing'
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [pendingClasses, setPendingClasses] = useState([]);
  const [ongoingClasses, setOngoingClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 20,
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch when tab or page changes
  useEffect(() => {
    fetchClasses();
  }, [tab, page]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(1); // Always reset to first page when switching tabs
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      if (tab === "pending") {
        const data = await getPendingClassesService(page, limit);
        setPendingClasses(data.classes || []);
        setPagination(data.pagination || {});
      } else {
        // Fetch ALL pages for approved
        let allClasses = [];
        let currentPage = 1;
        let totalPages = 1;

        do {
          const data = await getAllClassesService(currentPage, limit);
          allClasses = [...allClasses, ...(data.classes || [])];
          totalPages = data.pagination?.totalPages || 1;
          currentPage++;
        } while (currentPage <= totalPages);

        const approvedOnly = allClasses.filter(
          (cls) => cls.status?.toLowerCase() === "approved"
        );

        setOngoingClasses(approvedOnly);
        setPagination({ totalPages: 1, currentPage: 1 }); // no need for multi-page in UI
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    console.log("🔍 handleApprove called");
    console.log("➡ Approving Class ID:", id);

    try {
      const result = await approveClassService(id);
      console.log("✅ Approve Service Response:", result);
      await fetchClasses(); // refresh list
    } catch (err) {
      console.error(
        "❌ Approve error:",
        err.response?.data || err.message || err
      );
    }

    setOpenDropdownIndex(null);
  };

  // ClassModeration.jsx
  const handleReject = async (id) => {
    console.log("🔍 handleReject called");
    console.log("➡ Rejecting Class ID:", id);

    try {
      const result = await rejectClassService(id);
      console.log("✅ Reject Service Response:", result);
      await fetchClasses();
    } catch (err) {
      console.error(
        "❌ Reject error:",
        err.response?.data || err.message || err
      );
    }
  };

  const openClassDetail = async (id) => {
    try {
      const res = await getClassDetailService(id);
      setSelectedClass(res.data.class);
    } catch (err) {
      console.error("Class detail error:", err);
    }
  };

  const classesToShow = tab === "pending" ? pendingClasses : ongoingClasses;

  const filteredClasses = classesToShow.filter((classItem) =>
    classItem.class_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="class-moderation-container">
      <h1 className="class-moderation-header">Class Moderation</h1>

      <div className="tab-buttons">
        <button
          className={tab === "pending" ? "active" : ""}
          onClick={() => handleTabChange("pending")}
        >
          Upcoming Classes (Require Approval)
        </button>
        <button
          className={tab === "ongoing" ? "active" : ""}
          onClick={() => handleTabChange("ongoing")}
        >
          Ongoing Classes
        </button>
      </div>

      <div className="class-moderation-actions">
        <div className="class-moderation-search">
          <span role="img" aria-label="search">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="class-moderation-filter">
          <option>Instructor</option>
        </select>
        <select className="class-moderation-filter">
          <option>Type</option>
        </select>
        <select className="class-moderation-filter">
          <option>Status</option>
        </select>
        <select className="class-moderation-filter">
          <option>Date</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="class-table">
          <thead>
            <tr>
              <th>Instructor</th>
              <th>Title</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Slots</th>
              <th>Status</th>
              {tab === "pending" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((classItem, index) => (
              <tr
                key={classItem.id}
                className="clickable-row"
                onClick={() => openClassDetail(classItem.id)}
              >
                <td>{classItem.instructor_name}</td>
                <td>{classItem.class_title}</td>
                <td>{classItem.class_type}</td>
                <td>{classItem.max_students}</td>
                <td>{classItem.price}</td>
                <td>{classItem.current_students}</td>
                <td>
                  <span className="status-label">{classItem.status}</span>
                </td>
                {tab === "pending" && (
                  <td
                    className="class-actions"
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: "relative" }}
                  >
                    <span onClick={() => setOpenDropdownIndex(index)}>⋮</span>
                    {openDropdownIndex === index && (
                      <div className="dropdown-menu" ref={dropdownRef}>
                        <div onClick={() => handleApprove(classItem.id)}>
                          Approve
                        </div>
                        <div onClick={() => handleReject(classItem.id)}>
                          Reject
                        </div>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {selectedClass && (
        <div
          className="class-popup-overlay"
          onClick={() => setSelectedClass(null)}
        >
          <div
            className="class-popup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h2>{selectedClass.class_title}</h2>
              <X
                className="popup-close"
                onClick={() => setSelectedClass(null)}
              />
            </div>
            <p>
              <strong>Instructor:</strong> {selectedClass.instructor_name}
            </p>
            <p>
              <strong>Type:</strong> {selectedClass.class_type}
            </p>
            <p>
              <strong>Capacity:</strong> {selectedClass.max_students}
            </p>
            <p>
              <strong>Slots:</strong> {selectedClass.current_students}
            </p>
            <p>
              <strong>Price:</strong> {selectedClass.price}
            </p>
            <p>
              <strong>Status:</strong> {selectedClass.status}
            </p>
            <p>
              <strong>Dance Style:</strong> {selectedClass.dance_style}
            </p>
            <p>
              <strong>Skill Level:</strong> {selectedClass.skill_level}
            </p>
            <p>
              <strong>Prerequisites:</strong> {selectedClass.prerequisites}
            </p>
            <p>
              <strong>Equipment Needed:</strong>{" "}
              {selectedClass.equipment_needed}
            </p>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {Array.from(
          { length: Math.ceil(pagination.total / pagination.limit) },
          (_, i) => (
            <button
              key={i + 1}
              className={pagination.page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}

        <button
          disabled={
            pagination.page >= Math.ceil(pagination.total / pagination.limit)
          }
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClassModeration;
