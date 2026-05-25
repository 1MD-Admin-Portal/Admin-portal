import React from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import "./DeleteModal.css";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-modal-icon">
            <AlertTriangle size={24} />
          </div>
          <button
            className="delete-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-modal-content">
          <h2>{title}</h2>
          <p className="delete-modal-message">{message}</p>
          {itemName && (
            <div className="delete-modal-item-name">
              <span className="item-label">Item:</span>
              <span className="item-value">{itemName}</span>
            </div>
          )}
        </div>

        <div className="delete-modal-footer">
          <button
            type="button"
            className="btn-cancel-delete"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn-delete ${loading ? "loading" : ""}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "" : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
