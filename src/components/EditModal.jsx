import React, { useState } from 'react';

const EditModal = ({ dancer, onClose }) => {
  const [name, setName] = useState(dancer.name);
  const [email, setEmail] = useState(dancer.email);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Dancer</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={onClose}>Save</button>
      </div>
    </div>
  );
};

export default EditModal;
