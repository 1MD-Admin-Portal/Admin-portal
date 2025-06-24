import React, { useState } from "react";

const AppVersionInfo = () => {
  const [version] = useState("1.4.2");

  const containerStyle = {
    padding: "2rem",
    maxWidth: "600px",
    margin: "auto",
    borderRadius: "16px",
    backgroundColor: "#f9fafb",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "2rem",
  };

  const versionWrapper = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.3rem",
    fontWeight: "500",
    gap: "1rem",
    marginBottom: "2rem",
  };

  const versionNumberStyle = {
    fontSize: "1.6rem",
    fontWeight: "600",
  };

  const buttonStyle = {
    padding: "0.8rem 2rem",
    fontSize: "1.1rem",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>App Version</div>
      <div style={versionWrapper}>
        <span>Current Version</span>
        <span style={versionNumberStyle}>{version}</span>
      </div>
      <button style={buttonStyle}>Check</button>
    </div>
  );
};

export default AppVersionInfo;
