// import React from "react";


// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   isLoading = false,
// }) => {
//   const handlePrevious = () => {
//     if (currentPage > 1 && !isLoading) {
//       onPageChange(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages && !isLoading) {
//       onPageChange(currentPage + 1);
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "12px 24px",
//         backgroundColor: "#ffffff",
//         borderTop: "1px solid #e2e8f0",
//         boxSizing: "border-box",
//         marginTop: "1rem",
//       }}
//     >
//       <button
//         style={{
//           ...btnStyle,
//           ...(currentPage === 1 || isLoading ? disabledStyle : {}),
//         }}
//         onClick={handlePrevious}
//         disabled={currentPage === 1 || isLoading}
//         aria-label="Previous page"
//       >
//         Previous
//       </button>

//       <span style={infoStyle}>
//         Page {currentPage} of {totalPages}
//       </span>

//       <button
//         style={{
//           ...btnStyle,
//           ...(currentPage === totalPages || isLoading ? disabledStyle : {}),
//         }}
//         onClick={handleNext}
//         disabled={currentPage === totalPages || isLoading}
//         aria-label="Next page"
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// const btnStyle = {
//   padding: "8px 12px",
//   backgroundColor: "transparent",
//   color: "#6b7280",
//   border: "none",
//   borderRadius: 0,
//   fontSize: "0.9375rem",
//   fontWeight: 400,
//   cursor: "pointer",
//   fontFamily: "inherit",
//   transition: "color 0.15s ease",
// };

// const disabledStyle = {
//   color: "#d1d5db",
//   cursor: "not-allowed",
// };

// const infoStyle = {
//   fontSize: "0.9375rem",
//   color: "#6b7280",
//   fontFamily: "inherit",
// };

// export default Pagination;
import React, { useState } from "react";

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9 13L5 9L9 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5 5L9 9L5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronsLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M11 13L7 9L11 5M6 13L2 9L6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronsRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 5L7 9L3 13M8 5L12 9L8 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis-start", current - 1, current, current + 1, "ellipsis-end", total];
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showJumpTo = true,
  isLoading = false,
}) => {
  const [jumpValue, setJumpValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const go = (page) => {
    if (!isLoading && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleJumpChange = (e) => {
    const val = e.target.value;
    // only allow positive integers, no decimals, no negatives, no zeros
    if (val === "" || (/^\d+$/.test(val) && parseInt(val) >= 1 && parseInt(val) <= totalPages)) {
      setJumpValue(val);
      setIsInvalid(false);
    } else {
      // briefly flash invalid state without updating value
      setIsInvalid(true);
    }
  };

  const handleJump = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(jumpValue);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        go(page);
        setJumpValue("");
        setIsInvalid(false);
      } else {
        setIsInvalid(true);
        setJumpValue("");
      }
    }
  };

  const handleBlur = () => {
    setJumpValue("");
    setIsInvalid(false);
  };

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div style={s.bar}>
      {/* Left — page info */}
      <div style={s.left}>
        <span style={s.info}>
          Page <strong style={s.strong}>{currentPage}</strong> of{" "}
          <strong style={s.strong}>{totalPages}</strong>
        </span>
      </div>

      {/* Center — page buttons */}
      <div style={s.center}>
        {showFirstLast && (
          <button
            style={{
              ...s.btn,
              ...(currentPage === 1 || isLoading ? s.btnDisabled : {}),
            }}
            onClick={() => go(1)}
            disabled={currentPage === 1 || isLoading}
            aria-label="First page"
          >
            <ChevronsLeft />
          </button>
        )}
        <button
          style={{
            ...s.btn,
            ...(currentPage === 1 || isLoading ? s.btnDisabled : {}),
          }}
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>

        {pages.map((page, i) =>
          typeof page === "string" ? (
            <span key={page + i} style={s.ellipsis}>···</span>
          ) : (
            <button
              key={page}
              onClick={() => go(page)}
              disabled={isLoading}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              style={{
                ...s.btn,
                ...(page === currentPage ? s.active : {}),
                ...(isLoading && page !== currentPage ? s.btnDisabled : {}),
              }}
            >
              {page}
            </button>
          )
        )}

        <button
          style={{
            ...s.btn,
            ...(currentPage === totalPages || isLoading ? s.btnDisabled : {}),
          }}
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          aria-label="Next page"
        >
          <ChevronRight />
        </button>
        {showFirstLast && (
          <button
            style={{
              ...s.btn,
              ...(currentPage === totalPages || isLoading ? s.btnDisabled : {}),
            }}
            onClick={() => go(totalPages)}
            disabled={currentPage === totalPages || isLoading}
            aria-label="Last page"
          >
            <ChevronsRight />
          </button>
        )}
      </div>

      {/* Right — jump to */}
      <div style={s.right}>
        {showJumpTo && (
          <div style={s.jump}>
            <span style={s.label}>Go to</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              onChange={handleJumpChange}
              onKeyDown={handleJump}
              onBlur={handleBlur}
              placeholder={String(currentPage)}
              style={{
                ...s.jumpInput,
                ...(isInvalid ? s.jumpInputInvalid : {}),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    border: "0.5px solid #e5e7eb",
    borderRadius: "8px",
    background: "#ffffff",
    fontFamily: "inherit",
    gap: "12px",
  },
  left: { display: "flex", alignItems: "center", minWidth: "100px" },
  center: { display: "flex", alignItems: "center", gap: "2px" },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "100px",
    justifyContent: "flex-end",
  },
  info: { fontSize: "13px", color: "#6b7280" },
  strong: { color: "#111827", fontWeight: 500 },
  btn: {
    width: "30px",
    height: "30px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    border: "0.5px solid transparent",
    background: "transparent",
    fontSize: "13px",
    fontWeight: 400,
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.1s, border-color 0.1s, color 0.1s",
  },
  btnDisabled: {
    color: "#d1d5db",
    cursor: "not-allowed",
  },
  active: {
    background: "#f3f4f6",
    borderColor: "#d1d5db",
    color: "#111827",
    fontWeight: 500,
    cursor: "default",
  },
  ellipsis: {
    width: "30px",
    height: "30px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    fontSize: "13px",
  },
  label: { fontSize: "13px", color: "#6b7280" },
  jump: { display: "flex", alignItems: "center", gap: "6px" },
  jumpInput: {
    width: "44px",
    height: "30px",
    textAlign: "center",
    fontSize: "13px",
    fontFamily: "inherit",
    border: "0.5px solid #d1d5db",
    borderRadius: "6px",
    color: "#111827",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s",
  },
  jumpInputInvalid: {
    borderColor: "#ef4444",
    color: "#ef4444",
  },
};

export default Pagination;