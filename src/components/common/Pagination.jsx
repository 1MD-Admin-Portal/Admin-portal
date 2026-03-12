import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        boxSizing: "border-box",
        marginTop: "1rem",
      }}
    >
      <button
        style={{
          ...btnStyle,
          ...(currentPage === 1 || isLoading ? disabledStyle : {}),
        }}
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
      >
        Previous
      </button>

      <span style={infoStyle}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        style={{
          ...btnStyle,
          ...(currentPage === totalPages || isLoading ? disabledStyle : {}),
        }}
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

const btnStyle = {
  padding: "8px 12px",
  backgroundColor: "transparent",
  color: "#6b7280",
  border: "none",
  borderRadius: 0,
  fontSize: "0.9375rem",
  fontWeight: 400,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "color 0.15s ease",
};

const disabledStyle = {
  color: "#d1d5db",
  cursor: "not-allowed",
};

const infoStyle = {
  fontSize: "0.9375rem",
  color: "#6b7280",
  fontFamily: "inherit",
};

export default Pagination;