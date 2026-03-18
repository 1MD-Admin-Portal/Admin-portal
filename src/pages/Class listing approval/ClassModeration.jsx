import React, { useState, useRef, useEffect } from "react";
import GlobalLoader from "../../components/common/GlobalLoader";
import Pagination from "../../components/common/Pagination";
import "./ClassModeration.css";
import { X, CheckCircle, XCircle, Euro } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Search, Calendar } from "lucide-react";
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

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filter states
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

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
  }, [tab, page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(1);
    setSelectedIds([]);
    setSelectAll(false);
  };

  const fetchClasses = async (
    currentPage = page,
    currentSearch = debouncedSearch,
    fromDate = dateFrom,
    toDate = dateTo,
  ) => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        limit,
        search: currentSearch,
        date_from: fromDate ? fromDate.toLocaleDateString("en-CA") : undefined,
        date_to: toDate ? toDate.toLocaleDateString("en-CA") : undefined,
      };

      if (tab === "pending") {
        const data = await getPendingClassesService(payload);
        setPendingClasses(data.classes || []);
        setPagination(data.pagination || { page: 1, total: 0, limit });
      } else {
        const data = await getAllClassesService({
          ...payload,
          status: "approved",
        });
        setOngoingClasses(data.classes || []);
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

  const filteredClasses = tab === "pending" ? pendingClasses : ongoingClasses;

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

      {/* Filter UI for both tabs */}
      {(tab === "pending" || tab === "ongoing") && (
        <div className="class-mod-filter-toolbar">
          <div className="class-mod-filter-search">
            <Search className="class-mod-filter-icon" />
            <input
              type="text"
              placeholder="Search by class title or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="class-mod-filter-input"
            />
          </div>
          <div className="class-mod-filter-date">
            <Calendar className="class-mod-filter-icon" />
            <DatePicker
              selected={dateFrom}
              onChange={(date) => setDateFrom(date)}
              onChangeRaw={(e) => e.preventDefault()}
              placeholderText="From"
              className="class-mod-filter-input"
              dateFormat="dd-MM-yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          <div className="class-mod-filter-date">
            <Calendar className="class-mod-filter-icon" />
            <DatePicker
              selected={dateTo}
              onChange={(date) => setDateTo(date)}
              minDate={dateFrom}
              onChangeRaw={(e) => e.preventDefault()}
              placeholderText="To"
              className="class-mod-filter-input"
              dateFormat="dd-MM-yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          <button
            className="class-mod-filter-apply"
            onClick={() => {
              setPage(1);
              setDebouncedSearch(search);
              fetchClasses(1, search, dateFrom, dateTo);
            }}
          >
            Apply Filters
          </button>

          <button
            className="class-mod-filter-apply"
            style={{ marginLeft: 8, background: "#f3f4f6", color: "#a78bfa" }}
            onClick={() => {
              setSearch("");
              setDebouncedSearch("");
              setDateFrom(null);
              setDateTo(null);
              setPage(1);

              fetchClasses(1, "", null, null); // ✅ pass cleared values
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Remove old search UI for pending tab, now handled in filter UI above */}

      {loading ? (
        <GlobalLoader text="Loading classes..." />
      ) : (
        <div
          className="class-mod-table-container"
          style={{
            background: "var(--ev-white)",
            borderRadius: "var(--ev-radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--ev-shadow-md)",
            border: "1px solid var(--ev-border)",
            marginBottom: "1.5rem",
          }}
        >
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
                <th>Created at</th>
                <th>
                  <Euro size={16} />
                  Price
                </th>
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
                  <td
                    onClick={() => openClassDetail(classItem.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {classItem.instructor_name}
                  </td>
                  <td
                    onClick={() => openClassDetail(classItem.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {classItem.class_title}
                  </td>
                  <td>{classItem.class_type}</td>
                  <td>{classItem.max_students}</td>
                  <td>
                    {new Date(classItem.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <Euro size={14} />
                    {classItem.price}
                  </td>
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
        </div>
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
                  { label: "Price ( € )", value: selectedClass.price },
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
