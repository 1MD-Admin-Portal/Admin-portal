import React, { useState, useRef, useEffect } from "react";
import "./ClassModeration.css";
import { X } from "lucide-react";
import {
  getPendingClassesService,
  getAllClassesService,
  getClassDetailService,
  approveClassService,
  rejectClassService,
} from "../../services/class.service";

const ClassModeration = () => {
  const [tab, setTab] = useState("pending");
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
    limit: 10,
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  useEffect(() => {
    fetchClasses();
  }, [tab, page]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(1);
    setSelectedIds([]);
    setSelectAll(false);
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      if (tab === "pending") {
        const data = await getPendingClassesService(page, limit);
        setPendingClasses(data.classes || []);
        setPagination(data.pagination || { page: 1, total: 0, limit });
      } else {
        const data = await getAllClassesService(page, limit);
        const approvedOnly = (data.classes || []).filter(
          (cls) => cls.status?.toLowerCase() === "approved"
        );
        setOngoingClasses(approvedOnly);
        setPagination(data.pagination || { page: 1, total: 0, limit });
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveClassService(id);
      await fetchClasses();
    } catch (err) {
      console.error("Approve error:", err);
    }
    setSelectedClass(null);
  };

  const handleReject = async (id) => {
    try {
      await rejectClassService(id);
      await fetchClasses();
    } catch (err) {
      console.error("Reject error:", err);
    }
    setSelectedClass(null);
  };

  const handleBulkAction = async (action) => {
    const idsToProcess =
      selectedIds.length > 0 ? selectedIds : filteredClasses.map((c) => c.id);

    for (let id of idsToProcess) {
      if (action === "approve") {
        await approveClassService(id);
      } else {
        await rejectClassService(id);
      }
    }
    await fetchClasses();
    setSelectedIds([]);
    setSelectAll(false);
    setSelectedClass(null);
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

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClasses.map((c) => c.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Helper function to render info items in grid
  const renderInfoGrid = (items) => {
    return (
      <div className="info-grid">
        {items.map((item, index) => (
          <div key={index} className={`info-item ${item.status || ""}`}>
            <div className="info-label">{item.label}</div>
            <div className="info-value">{item.value}</div>
          </div>
        ))}
      </div>
    );
  };

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

      {tab === "pending" && (
        <div className="bulk-actions">
          <button onClick={() => handleBulkAction("approve")}>
            {selectedIds.length
              ? `Approve Selected (${selectedIds.length})`
              : "Approve All"}
          </button>
          <button onClick={() => handleBulkAction("reject")}>
            {selectedIds.length
              ? `Reject Selected (${selectedIds.length})`
              : "Reject All"}
          </button>
        </div>
      )}

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
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="class-table">
          <thead>
            <tr>
              {tab === "pending" && (
                <>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                </>
              )}
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
              <tr key={classItem.id} className="clickable-row">
                {tab === "pending" && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(classItem.id)}
                      onChange={() => toggleSelectOne(classItem.id)}
                    />
                  </td>
                )}
                <td onClick={() => openClassDetail(classItem.id)}>
                  {classItem.instructor_name}
                </td>
                <td onClick={() => openClassDetail(classItem.id)}>
                  {classItem.class_title}
                </td>
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

      {/* Pagination */}
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

      {/* Enhanced Detail Modal with exact DancersList structure */}
      {selectedClass && (
        <div
          className="class-popup-overlay"
          onClick={() => setSelectedClass(null)}
        >
          <div
            className="class-popup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="popup-header">
              <h2>Class Details</h2>
              <X
                className="popup-close"
                onClick={() => setSelectedClass(null)}
              />
            </div>

            {/* Modal Body - Scrollable */}
            <div className="modal-body">
              {/* Basic Information Section */}
              <div className="modal-section">
                <h4>Basic Information</h4>
                {renderInfoGrid([
                  { label: "Class Title", value: selectedClass.class_title },
                  { label: "Instructor", value: selectedClass.instructor_name },
                  { label: "Type", value: selectedClass.class_type },
                  { label: "Dance Style", value: selectedClass.dance_style },
                  { label: "Skill Level", value: selectedClass.skill_level },
                  { label: "Max Students", value: selectedClass.max_students },
                  {
                    label: "Current Students",
                    value: selectedClass.current_students,
                  },
                  { label: "Price", value: selectedClass.price },
                  {
                    label: "Status",
                    value: selectedClass.status,
                    status:
                      selectedClass.status?.toLowerCase() === "approved"
                        ? "status-active"
                        : "status-inactive",
                  },
                ])}
              </div>

              {/* Class Requirements Section */}
              <div className="modal-section">
                <h4>Class Requirements</h4>
                {renderInfoGrid([
                  {
                    label: "Prerequisites",
                    value: selectedClass.prerequisites || "None",
                  },
                  {
                    label: "Equipment Needed",
                    value: selectedClass.equipment_needed || "None",
                  },
                ])}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                className="modal-close-btn"
                onClick={() => setSelectedClass(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassModeration;
