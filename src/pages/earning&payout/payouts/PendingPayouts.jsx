import React, { useState, useEffect } from "react";
import GlobalLoader from "../../../components/common/GlobalLoader";
import Pagination from "../../../components/common/Pagination";
import {
  getPendingPayoutsService,
  uploadTransferProofService,
  processPayoutService,
} from "../../../services/payouts.service";
import "./PendingPayouts.css";

// ── SVG Icons ──────────────────────────────────────────
const IconMarkPaid = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconSpinner = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="spin-icon"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const IconClose = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={14}
    height={14}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Custom Modal ───────────────────────────────────────
const Modal = ({ modal, onClose, onConfirm, inputValue, setInputValue }) => {
  if (!modal) return null;
  return (
    <div className="pp-modal-overlay" onClick={onClose}>
      <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pp-modal-header">
          <div className="pp-modal-icon-wrap">{modal.icon}</div>
          <button className="pp-modal-x" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className="pp-modal-body">
          <h3 className="pp-modal-title">{modal.title}</h3>
          <p className="pp-modal-message">{modal.message}</p>
          {modal.type === "prompt" && (
            <input
              className="pp-modal-input"
              type="text"
              placeholder={modal.placeholder || ""}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && onConfirm()}
            />
          )}
        </div>
        <div className="pp-modal-footer">
          {modal.type !== "alert" && (
            <button className="pp-btn-cancel" onClick={onClose}>
              Cancel
            </button>
          )}
          <button className="pp-btn-confirm" onClick={onConfirm}>
            {modal.type === "alert" ? "OK" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────
const PendingPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingProof, setUploadingProof] = useState({});
  const [processingPayout, setProcessingPayout] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  // Modal state
  const [modal, setModal] = useState(null);
  const [modalInput, setModalInput] = useState("");
  const [modalResolve, setModalResolve] = useState(null);

  const showAlert = (title, message, icon = "✅") =>
    new Promise((resolve) => {
      setModal({ type: "alert", title, message, icon });
      setModalResolve(() => resolve);
    });

  const showPrompt = (title, message, placeholder = "", icon = "✏️") =>
    new Promise((resolve) => {
      setModalInput("");
      setModal({ type: "prompt", title, message, placeholder, icon });
      setModalResolve(() => (val) => resolve(val));
    });

  const handleModalClose = () => {
    setModal(null);
    if (modalResolve)
      modal?.type === "prompt" ? modalResolve(null) : modalResolve();
  };

  const handleModalConfirm = () => {
    setModal(null);
    if (modalResolve)
      modal?.type === "prompt" ? modalResolve(modalInput) : modalResolve();
  };

  // ── Fetch ──
  const fetchPayouts = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await getPendingPayoutsService(page, limit);
      setPayouts(Array.isArray(response.payouts) ? response.payouts : []);
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

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (newPage >= 1 && newPage <= totalPages)
      fetchPayouts(newPage, pagination.limit);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
    }).format(amount || 0);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // ── Upload proof ──
  const handleFileUpload = async (payoutId, event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (files.some((f) => !allowed.includes(f.type))) {
      await showAlert(
        "Invalid File Type",
        "Please select only PDF or image files (JPG, PNG).",
        "⚠️",
      );
      event.target.value = "";
      return;
    }

    setUploadingProof((prev) => ({ ...prev, [payoutId]: true }));
    try {
      const result = await uploadTransferProofService(payoutId, files, "", "");
      // Refresh the payouts list to sync with backend state
      // This ensures if backend auto-completes the payout, UI reflects it
      await fetchPayouts(pagination.page, pagination.limit);
      await showAlert(
        "Upload Successful",
        result.message || "Transfer proof uploaded successfully!",
        "✅",
      );
    } catch (error) {
      const msg =
        error.response?.status === 404
          ? "Payout not found. It may have already been processed."
          : error.response?.data?.error ||
            error.message ||
            "Failed to upload transfer proof.";
      await showAlert("Upload Failed", msg, "❌");
    } finally {
      setUploadingProof((prev) => ({ ...prev, [payoutId]: false }));
      event.target.value = "";
    }
  };

  // ── Process payout ──
  const handleProcessPayout = async (payout) => {
    const payoutId = payout.id;

    const paymentReference = await showPrompt(
      "Payment Reference",
      "Enter a payment reference for this payout (optional).",
      "e.g. TXN-20250218",
      "🔖",
    );
    if (paymentReference === null) return;

    const adminNotes = await showPrompt(
      "Admin Notes",
      "Add any notes for this payout (optional).",
      "e.g. Processed via bank transfer",
      "📝",
    );
    if (adminNotes === null) return;

    setProcessingPayout((prev) => ({ ...prev, [payoutId]: true }));
    try {
      const result = await processPayoutService(payoutId, {
        adminNotes,
        paymentReference,
        transferProofUrls: payout.transfer_proof_urls || [],
      });
      setPayouts((prev) => prev.filter((p) => p.id !== payoutId));
      await showAlert(
        "Payout Completed",
        result.message || "Payout marked as completed!",
        "🎉",
      );
    } catch {
      await showAlert(
        "Error",
        "Failed to process payout. Please try again.",
        "❌",
      );
    } finally {
      setProcessingPayout((prev) => ({ ...prev, [payoutId]: false }));
    }
  };

  return (
    <div className="pending-payouts-container">
      <Modal
        modal={modal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        inputValue={modalInput}
        setInputValue={setModalInput}
      />

      <div className="container">
        <div className="header">
          <h1 className="main-title">Pending Payouts</h1>
          <p className="subtitle">
            Manage and process pending payouts for instructors and DJs
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon total-pending">€</div>
              {/* <div className="stat-info"> */}
              <p className="stat-label">Total Pending</p>
              <p className="stat-value">
                {formatCurrency(payouts.reduce((s, p) => s + p.amount, 0))}
              </p>
              {/* </div> */}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon pending-requests">⏰</div>
              {/* <div className="stat-info"> */}
              <p className="stat-label">Pending Requests</p>
              <p className="stat-value">{pagination.total}</p>
              {/* </div> */}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon unique-users">👤</div>
              {/* <div className="stat-info"> */}
              <p className="stat-label">Unique Users</p>
              <p className="stat-value">
                {new Set(payouts.map((p) => p.user.id)).size}
              </p>
              {/* </div> */}
            </div>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <GlobalLoader text="Loading payouts..." />
          ) : payouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <p className="empty-text">No pending payouts found</p>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="payouts-table">
                  <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                  </colgroup>
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
                                {payout.transfer_proof_urls?.length > 0 && (
                                  <div className="proof-links">
                                    {payout.transfer_proof_urls.map(
                                      (url, i) => (
                                        <a
                                          key={i}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="proof-link"
                                        >
                                          View Proof {i + 1}
                                        </a>
                                      ),
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
                                    className={`upload-btn ${uploadingProof[payout.id] ? "uploading" : ""}`}
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
                              className={`btn btn-process${processingPayout[payout.id] ? " processing" : ""}`}
                              onClick={() => handleProcessPayout(payout)}
                              disabled={processingPayout[payout.id]}
                              title="Mark as Paid"
                            >
                              {processingPayout[payout.id] ? (
                                <IconSpinner />
                              ) : (
                                <IconMarkPaid />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        {
          <Pagination
            currentPage={pagination.page || 1}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        }
      </div>
    </div>
  );
};

export default PendingPayouts;
