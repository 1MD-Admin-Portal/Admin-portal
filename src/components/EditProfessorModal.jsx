import React, { useState } from 'react';

const EditProfessorModal = ({ professor, onClose }) => {
  const [name, setName] = useState(professor.name);
  const [email, setEmail] = useState(professor.email);

  const handleSubmit = () => {
    
    onClose();
  };

  return (

      <div className="modal-content">
        <h2>Edit Instructor</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose} style={{ marginLeft: '8px', background: '#6b7280' }}>Cancel</button>
      </div>

  );
};

export default EditProfessorModal;
