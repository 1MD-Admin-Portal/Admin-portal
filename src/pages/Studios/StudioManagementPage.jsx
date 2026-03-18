import React, { useEffect, useState } from "react";
// import { Plus, Edit2, Trash2, Eye, AlertCircle, Check } from "lucide-react";
import GlobalLoader from "../../components/common/GlobalLoader";
import Pagination from "../../components/common/Pagination";
import {
  getStudios,
  createStudio,
  updateStudio,
  deleteStudio,
} from "../../services/studio.service";
import CreateEditStudioModal from "../../components/studio/CreateEditStudioModal";
import DeleteModal from "../../components/DeleteModal";
import StudioDetailDrawer from "../../components/studio/StudioDetailDrawer";
import StudioStatisticsSection from "../../components/studio/StudioStatisticsSection";
// import InstructorLinkModal from "../../components/studio/InstructorLinkModal";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  Check,
  UserPlus,
} from "lucide-react";
import "./StudioManagementPage.css";

const StudioManagementPage = () => {
  // State
  const [studios, setStudios] = useState([]);
  const [pagination, setPagination] = useState({
    total_pages: 1,
    current_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal and Drawer State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studioToDelete, setStudioToDelete] = useState(null);
  const [instructorModalOpen, setInstructorModalOpen] = useState(false);
  const [instructorModalStudio, setInstructorModalStudio] = useState(null);

  // Search and Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadStudios(currentPage);
  }, [currentPage, searchQuery, statusFilter]);

  const loadStudios = async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      // Map statusFilter to API param (skip if 'all')
      const statusParam = statusFilter !== "all" ? statusFilter : undefined;
      const response = await getStudios(pageNum, searchQuery, statusParam);
      setStudios(Array.isArray(response?.studios) ? response.studios : []);
      const paginationData = response?.pagination || {
        total_pages: 1,
        current_page: 1,
      };
      setPagination(paginationData);
    } catch (err) {
      console.error("Error loading studios:", err);
      setError("Failed to load studios. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    loadStudios(1);
  };

  // Modal Handlers
  const handleCreateClick = () => {
    setSelectedStudio(null);
    setModalOpen(true);
  };

  const handleEditClick = (studio) => {
    setSelectedStudio(studio);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedStudio(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (selectedStudio) {
        await updateStudio(selectedStudio.id, formData);
        setSuccessMessage("Studio updated successfully!");
      } else {
        await createStudio(formData);
        setSuccessMessage("Studio created successfully!");
      }
      handleModalClose();
      loadStudios(currentPage);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error saving studio:", err);
      setError("Failed to save studio. Please try again.");
    }
  };

  // Drawer Handlers
  const handleViewDetails = async (studio) => {
    setSelectedStudio(studio);
    setDrawerOpen(true);
    setDrawerLoading(false);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedStudio(null);
  };

  // Delete Handler
  const handleDeleteClick = (studio) => {
    setStudioToDelete(studio);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studioToDelete?.id) return;
    setLoading(true);
    try {
      await deleteStudio(studioToDelete.id);
      setSuccessMessage("Studio deleted successfully!");
      setDeleteModalOpen(false);
      setStudioToDelete(null);
      loadStudios(currentPage);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error deleting studio:", err);
      setError("Failed to delete studio. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setStudioToDelete(null);
  };

  // const handleManageInstructors = (studio) => {
  //   setInstructorModalStudio(studio);
  //   setInstructorModalOpen(true);
  // };

  // No need to filter on UI, API now returns filtered studios
  const filteredStudios = studios;

  return (
    <div className="studio-management-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Studio Management</h1>
          <p>Manage all dance studios and their details</p>
        </div>
        <button className="btn-create" onClick={handleCreateClick}>
          <Plus size={18} /> Create Studio
        </button>
      </div>

      {/* Statistics Section */}
      <StudioStatisticsSection studios={studios} />

      {/* Messages */}
      {successMessage && (
        <div className="alert alert-success">
          <Check size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search studios by name, city, country..."
            value={searchQuery}
            onChange={handleSearch}
            onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
          />
          <button onClick={handleSearchSubmit} className="search-btn">
            Search
          </button>
        </div>

        <div className="filter-controls">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Studios</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Studios Table */}
      <div className="table-container">
        {loading ? (
          <GlobalLoader text="Loading studios..." />
        ) : filteredStudios.length === 0 ? (
          <div className="empty-state">
            <p>No studios found</p>
            <button onClick={handleCreateClick} className="btn-create">
              Create your first studio
            </button>
          </div>
        ) : (
          <table className="studios-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Country</th>
                <th>Capacity</th>
                <th>Est. Year</th>
                {/* <th>Instructors</th> */}
                <th>Created at</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudios.map((studio) => (
                <tr
                  key={studio.id}
                  className="studio-row"
                  style={{ cursor: "pointer" }}
                >
                  <td
                    className="studio-name"
                    onClick={() => handleViewDetails(studio)}
                  >
                    {studio.logo_url && (
                      <img
                        src={studio.logo_url}
                        alt={studio.name}
                        className="studio-thumbnail"
                      />
                    )}
                    <span>{studio.name}</span>
                  </td>
                  <td onClick={() => handleViewDetails(studio)}>
                    {studio.city || "N/A"}
                  </td>
                  <td onClick={() => handleViewDetails(studio)}>
                    {studio.country || "N/A"}
                  </td>
                  <td onClick={() => handleViewDetails(studio)}>
                    {studio.capacity || "N/A"}
                  </td>
                  <td>{studio.established_year || "N/A"}</td>
                  {/* <td>
                    <button
                      className="action-icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleManageInstructors(studio);
                      }}
                      title="Manage Instructors"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 12px",
                        width: "auto",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#4F7CF7",
                        borderColor: "rgba(79,124,247,0.3)",
                      }}
                    >
                      <UserPlus size={14} /> Manage
                    </button>
                  </td> */}
                  <td>
                    {new Date(studio.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <span className={`status-badge status-${studio.status}`}>
                      {studio.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="action-icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(studio);
                        }}
                        title="View"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="action-icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(studio);
                        }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        className="action-icon-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(studio);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.total_pages || 1}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      {/* Modal */}
      <CreateEditStudioModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        studio={selectedStudio}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Studio"
        message="Are you sure you want to delete this studio? This action cannot be undone. All associated data will be permanently removed."
        itemName={studioToDelete?.name}
        loading={loading}
      />

      {/* Detail Drawer */}
      <StudioDetailDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        studio={selectedStudio}
        loading={drawerLoading}
      />
      {/* <InstructorLinkModal
        isOpen={instructorModalOpen}
        onClose={() => {
          setInstructorModalOpen(false);
          setInstructorModalStudio(null);
        }}
        studio={instructorModalStudio}
      /> */}
    </div>
  );
};

export default StudioManagementPage;
