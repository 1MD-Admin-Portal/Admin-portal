import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (

    <div className="modal-content small">
      <h2>Confirmation</h2>
      <p>{message}</p>
      <div className="modal-actions">
        <button onClick={onConfirm} className="btn confirm">Yes</button>
        <button onClick={onCancel} className="btn cancel">Cancel</button>
      </div>
    </div>

);

export default ConfirmationModal;
