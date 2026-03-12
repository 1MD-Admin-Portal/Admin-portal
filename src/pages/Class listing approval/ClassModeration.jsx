import React, { useState, useRef, useEffect } from "react";
import GlobalLoader from "../../components/common/GlobalLoader";
import Pagination from "../../components/common/Pagination";
import "./ClassModeration.css";
import { X, CheckCircle, XCircle } from "lucide-react";
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

  // Filter states
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  // Real-time search for ongoing classes
  useEffect(() => {
    if (tab === "ongoing") {
      setPage(1);
      fetchClasses();
    }
  }, [search]);

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
        const data = await getAllClassesService({
          page,
          limit,
          search,
          date_from: dateFrom,
          date_to: dateTo,
        });
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
      <div className="class-mod-info-grid">
        {items.map((item, index) => (
          <div
            key={index}
            className={`class-mod-info-item ${item.status || ""}`}
          >
            <div className="class-mod-info-label">{item.label}</div>
            <div className="class-mod-info-value">{item.value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="class-mod-container">
      <h1 className="class-mod-header">Class Moderation</h1>

      <div className="class-mod-tab-buttons">
        <button
          className={tab === "pending" ? "class-mod-tab-active" : ""}
          onClick={() => handleTabChange("pending")}
        >
          Upcoming Classes (Require Approval)
        </button>
        <button
          className={tab === "ongoing" ? "class-mod-tab-active" : ""}
          onClick={() => handleTabChange("ongoing")}
        >
          Ongoing Classes
        </button>
      </div>

      {tab === "pending" && (
        <div className="class-mod-bulk-actions">
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

      {tab === "ongoing" && (
        <div style={{
          background: "#f8f9ff", padding: "16px", borderRadius: "10px",
          marginBottom: "20px", border: "1px solid rgba(142,92,246,0.15)",
          display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center",
        }}>
          {/* Search */}
          <div style={{ flex: "1 1 200px" }}>
            <input
              type="text"
              placeholder="Search by class title or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: "6px",
                border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Date From */}
          <div style={{ flex: "1 1 150px" }}>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: "6px",
                border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Date To */}
          <div style={{ flex: "1 1 150px" }}>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: "6px",
                border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={() => {
              setPage(1);
              fetchClasses();
            }}
            style={{
              padding: "8px 16px", borderRadius: "6px", border: "none",
              background: "linear-gradient(135deg, #6c3de8, #ec4899)",
              color: "white", fontWeight: "600", fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Apply Filters
          </button>
        </div>
      )}

      <div className="class-mod-actions" style={{ display: tab === "ongoing" ? "none" : "flex" }}>
        <div className="class-mod-search">
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
        <GlobalLoader text="Loading classes..." />
      ) : (
        <table className="class-mod-table">
          <thead>
            <tr>
              {/* {tab === "pending" && (
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filteredClasses.map((cls) => cls.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={
                      selectedIds.length === filteredClasses.length &&
                      filteredClasses.length > 0
                    }
                  />
                </th>
              )} */}
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
            {filteredClasses.map((classItem) => (
              <tr key={classItem.id} className="class-mod-clickable-row">
                {/* {tab === "pending" && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(classItem.id)}
                      disabled={classItem.status?.toLowerCase() !== "pending"}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [...prev, classItem.id]);
                        } else {
                          setSelectedIds((prev) =>
                            prev.filter((id) => id !== classItem.id)
                          );
                        }
                      }}
                    />
                  </td>
                )} */}
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
                  <span className={`class-mod-status ${classItem.status}`}>
                    {classItem.status}
                  </span>
                </td>
                {tab === "pending" && (
                  <td className="class-mod-table-actions">
                    <CheckCircle
                      className={`class-mod-action-icon ${
                        classItem.status !== "pending_approval"
                          ? "class-mod-action-disabled"
                          : ""
                      }`}
                      onClick={() =>
                        classItem.status === "pending_approval" &&
                        handleApprove(classItem.id)
                      }
                    />
                    <XCircle
                      className={`class-mod-action-icon class-mod-reject ${
                        classItem.status !== "pending_approval"
                          ? "class-mod-action-disabled"
                          : ""
                      }`}
                      onClick={() =>
                        classItem.status === "pending_approval" &&
                        handleReject(classItem.id)
                      }
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page || 1}
        totalPages={Math.ceil(pagination.total / pagination.limit) || 1}
        onPageChange={setPage}
        isLoading={loading}
      />

      {/* Enhanced Detail Modal with exact DancersList structure */}
      {selectedClass && (
        <div
          className="class-mod-popup-overlay"
          onClick={() => setSelectedClass(null)}
        >
          <div
            className="class-mod-popup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="class-mod-popup-header">
              <h2>Class Details</h2>
              <X
                className="class-mod-popup-close"
                onClick={() => setSelectedClass(null)}
              />
            </div>

            {/* Modal Body - Scrollable */}
            <div className="class-mod-modal-body">
              {/* Basic Information Section */}
              <div className="class-mod-modal-section">
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
                        ? "class-mod-status-active"
                        : "class-mod-status-inactive",
                  },
                ])}
              </div>

              {/* Class Requirements Section */}
              <div className="class-mod-modal-section">
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
            {/* <div className="class-mod-modal-footer">
              <button
                className="class-mod-modal-close-btn"
                onClick={() => setSelectedClass(null)}
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassModeration;