import React from "react";
import "../../styles/global-loader.css";

/**
 * GlobalLoader Component
 * 
 * Unified loading state UI component used across all pages.
 * Displays a centered card with spinner and custom loading text.
 * 
 * @param {string} text - Custom loading text (default: "Loading...")
 * 
 * @example
 * if (loading) {
 *   return <GlobalLoader text="Loading events..." />
 * }
 */
const GlobalLoader = ({ text = "Loading..." }) => {
  return (
    <div className="global-loader-container">
      <div className="global-loader-card">
        <div className="global-loader-spinner"></div>
        <p className="global-loader-text">{text}</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
