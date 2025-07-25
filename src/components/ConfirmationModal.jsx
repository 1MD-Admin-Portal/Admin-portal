const ConfirmationModal = ({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <h3>Confirmation</h3>
          <div className="modal-body">{message}</div>
          <div className="modal-actions">
            <button className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button className="confirm-button" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
