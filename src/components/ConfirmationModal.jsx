import "./ConfirmationModal.css";

const ConfirmationModal = ({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
}) => {
  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Confirmation</h3>
        <div className="confirm-modal-body">{message}</div>
        <div className="confirm-modal-actions">
          <button className="confirm-cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-confirm-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
