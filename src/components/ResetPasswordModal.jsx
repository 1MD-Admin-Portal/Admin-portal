import React, { useState } from 'react';

const ResetPasswordModal = ({ dancer, onClose }) => {
  const [mode, setMode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (

      <div className="modal-content">
        <h2>Reset Password</h2>
        {mode === '' ? (
          <>
            <p>Please select one option to reset the password.</p>
            <button onClick={() => setMode('manual')}>Manual</button>
            <button onClick={onClose}>Send Link</button>
          </>
        ) : (
          <>
            <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button onClick={onClose}>Submit</button>
          </>
        )}
      </div>
  );
};

export default ResetPasswordModal;
