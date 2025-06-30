import React, { useState } from 'react';

const ResetProfessorPasswordModal = ({ professor, onClose }) => {
  const [mode, setMode] = useState(''); // '', 'manual'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendLink = () => {
    console.log(`Reset link sent to ${professor.email}`);
    onClose();
  };

  const handleManualReset = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log('New Password:', password);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Reset Password for {professor.name}</h2>

        {!mode && (
          <>
            <button onClick={() => setMode('manual')}>Manual Reset</button>
            <button onClick={handleSendLink} style={{ marginLeft: '8px' }}>Send Reset Link</button>
          </>
        )}

        {mode === 'manual' && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleManualReset}>Submit</button>
            <button onClick={onClose} style={{ marginLeft: '8px' }}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetProfessorPasswordModal;
