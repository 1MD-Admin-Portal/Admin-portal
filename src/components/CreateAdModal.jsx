import React, { useState } from 'react';
import '../styles/CreateAdModal.css'; // Assuming you have a CSS file for styling

const CreateAdModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    // Submit logic here
    onClose(); // Close modal after submission
  };

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Create New Ad</h2>

        <label>Ad Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter ad title"
        />

        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select</option>
          <option value="Home Banner">Home Banner</option>
          <option value="Feed Ad">Feed Ad</option>
          <option value="Footer Ad">Footer Ad</option>
        </select>

        <label>Upload Image</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <label>Link</label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="example.com"
        />

        <div className="modal-btns">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="create-btn" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateAdModal;
