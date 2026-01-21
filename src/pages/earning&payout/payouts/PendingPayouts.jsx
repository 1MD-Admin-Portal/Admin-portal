import React, { useState, useEffect } from "react";
import {
  getPendingPayoutsService,
  uploadTransferProofService,
  processPayoutService,
} from "../../../services/payouts.service";
import "./PendingPayouts.css";

const PendingPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingProof, setUploadingProof] = useState({});
  const [processingPayout, setProcessingPayout] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20, // ⬅ you can change to 5 to test pagination
    total: 0,
  });

  // 🔹 Fetch pending payouts
  const fetchPayouts = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await getPendingPayoutsService(page, limit);

      if (Array.isArray(response.payouts)) {
        setPayouts(response.payouts);
      } else {
        setPayouts([]);
      }

      setPagination({
        page: response.pagination?.page || page,
        limit: response.pagination?.limit || limit,
        total: response.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching payouts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts(pagination.page, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Handle pagination click
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPayouts(newPage, pagination.limit);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  // 💶 Single currency formatter – EUR everywhere
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
    }).format(amount || 0);

  // 🔹 Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // 🔹 Upload transfer proof
  const handleFileUpload = async (payoutId, event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert("Please select only PDF or image files (JPG, PNG)");
      event.target.value = "";
      return;
    }

    setUploadingProof((prev) => ({ ...prev, [payoutId]: true }));

    try {
      // Later you can add proper inputs for these (textarea, input)
      const adminNotes = ""; // or prompt("Enter admin notes (optional):") || "";
      const paymentReference = ""; // can be independent from complete

      const result = await uploadTransferProofService(
        payoutId,
        files,
        adminNotes,
        paymentReference
      );

      // Update payout row with new proof state
      setPayouts((prev) =>
        prev.map((payout) =>
          payout.id === payoutId
            ? {
                ...payout,
                has_transfer_proof: true,
                transfer_proof_urls:
                  result?.payout?.transfer_proof_urls ||
                  result?.transfer_proof_urls ||
                  payout.transfer_proof_urls,
              }
            : payout
        )
      );

      alert(result.message || "Transfer proof uploaded successfully!");
    } catch (error) {
      console.error("Upload error details:", error);

      if (error.response?.status === 404) {
        alert(
          "Payout not found. It may have already been processed or the ID is incorrect."
        );
      } else if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else if (error.message) {
        alert(`Upload failed: ${error.message}`);
      } else {
        alert("Failed to upload transfer proof. Please try again.");
      }
    } finally {
      setUploadingProof((prev) => ({ ...prev, [payoutId]: false }));
      event.target.value = "";
    }
  };

  // 🔹 Process payout = call PUT /complete
  const handleProcessPayout = async (payout) => {
    const payoutId = payout.id;

    // Optional prompts; later can be replaced with proper inputs
    const paymentReference =
      prompt("Enter payment reference (optional):") || "";
    const adminNotes = prompt("Enter admin notes (optional):") || "";

    setProcessingPayout((prev) => ({ ...prev, [payoutId]: true }));

    try {
      const result = await processPayoutService(payoutId, {
        adminNotes,
        paymentReference,
        transferProofUrls: payout.transfer_proof_urls || [],
      });

      // After successful processing, remove from pending list
      setPayouts((prev) => prev.filter((p) => p.id !== payoutId));

      alert(result.message || "Payout marked as completed!");
    } catch (error) {
      console.error("Error processing payout:", error);
      alert("Failed to process payout. Please try again.");
    } finally {
      setProcessingPayout((prev) => ({ ...prev, [payoutId]: false }));
    }
  };

  return (
    <div className="pending-payouts-container">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="main-title">Pending Payouts</h1>
          <p className="subtitle">
            Manage and process pending payouts for instructors and DJs
          </p>
        </div>

        {/* Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon total-pending">
                <i className="icon-euro">€</i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Pending</p>
                <p className="stat-value">
                  {formatCurrency(
                    payouts.reduce((sum, payout) => sum + payout.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon pending-requests">
                <i className="icon-clock">⏰</i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Pending Requests</p>
                <p className="stat-value">{pagination.total}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon unique-users">
                <i className="icon-user">👤</i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Unique Users</p>
                <p className="stat-value">
                  {new Set(payouts.map((p) => p.user.id)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <span className="loading-text">Loading payouts...</span>
            </div>
          ) : payouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <p className="empty-text">No pending payouts found</p>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="payouts-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Payment Details</th>
                      <th>Request Date</th>
                      <th>Days Pending</th>
                      <th>Transfer Proof</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="table-row">
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              {payout.user.avatar ? (
                                <img
                                  src={payout.user.avatar}
                                  alt={payout.user.name}
                                  className="avatar-img"
                                />
                              ) : (
                                <div className="avatar-placeholder">👤</div>
                              )}
                            </div>
                            <div className="user-details">
                              <div className="user-name">
                                {payout.user.name}
                              </div>
                              <div className="user-email">
                                {payout.user.email}
                              </div>
                              <span className={`user-type ${payout.user.type}`}>
                                {payout.user.type}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="amount-info">
                            <div className="amount">
                              {formatCurrency(payout.amount)}
                            </div>
                            <div className="transaction-count">
                              {payout.transaction_count} transactions
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="payment-method">
                            <i className="payment-icon">💳</i>
                            <span className="method-text">
                              {payout.payment_method.replace("_", " ")}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="payment-details">
                            <div>
                              <strong>Bank:</strong>{" "}
                              {payout.payment_details.bank_name}
                            </div>
                            <div>
                              <strong>Account:</strong> ****
                              {payout.payment_details.account_number.slice(-4)}
                            </div>
                            <div>
                              <strong>Holder:</strong>{" "}
                              {payout.payment_details.account_holder_name}
                            </div>
                            <div>
                              <strong>Routing:</strong>{" "}
                              {payout.payment_details.routing_number}
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="request-date">
                            <i className="calendar-icon">📅</i>
                            <span>{formatDate(payout.requested_at)}</span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`days-pending ${
                              payout.days_pending > 7
                                ? "urgent"
                                : payout.days_pending > 3
                                ? "warning"
                                : "normal"
                            }`}
                          >
                            {payout.days_pending} days
                          </span>
                        </td>

                        <td>
                          <div className="transfer-proof">
                            {payout.has_transfer_proof ? (
                              <div className="proof-uploaded">
                                <span className="proof-status uploaded">
                                  ✓ Uploaded
                                </span>
                                {payout.transfer_proof_urls &&
                                  payout.transfer_proof_urls.length > 0 && (
                                    <div className="proof-links">
                                      {payout.transfer_proof_urls.map(
                                        (url, index) => (
                                          <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="proof-link"
                                          >
                                            View Proof {index + 1}
                                          </a>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            ) : (
                              <div className="proof-missing">
                                <span className="proof-status missing">
                                  ✗ Missing
                                </span>
                                <div className="upload-section">
                                  <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                      handleFileUpload(payout.id, e)
                                    }
                                    className="file-input"
                                    id={`file-upload-${payout.id}`}
                                    disabled={uploadingProof[payout.id]}
                                  />
                                  <label
                                    htmlFor={`file-upload-${payout.id}`}
                                    className={`upload-btn ${
                                      uploadingProof[payout.id]
                                        ? "uploading"
                                        : ""
                                    }`}
                                  >
                                    {uploadingProof[payout.id]
                                      ? "Uploading..."
                                      : "Upload Proof"}
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-process"
                              onClick={() => handleProcessPayout(payout)}
                              disabled={processingPayout[payout.id]}
                            >
                              {processingPayout[payout.id]
                                ? "Processing..."
                                : "Mark as Paid"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    <p>
                      Showing{" "}
                      <span className="page-number">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="page-number">
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}
                      </span>{" "}
                      of <span className="page-number">{pagination.total}</span>{" "}
                      results
                    </p>
                  </div>

                  <div className="pagination-controls">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="pagination-btn prev-btn"
                    >
                      ❮ Previous
                    </button>

                    <div className="page-numbers">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNumber = i + 1;
                          } else if (pagination.page >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = pagination.page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`page-btn ${
                                pageNumber === pagination.page ? "active" : ""
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= totalPages}
                      className="pagination-btn next-btn"
                    >
                      Next ❯
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingPayouts;
