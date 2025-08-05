import React, { useState } from "react";
import "./Marketplacepage.css";

const MarketplacePage = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const data = [
    {
      id: 101,
      title: "Salsa Basics",
      instructor: "Maria Lopez",
      price: "$20",
      status: "Approved",
      type: "Program",
    },
    {
      id: 102,
      title: "Havana Nights",
      instructor: "Sabor Events",
      price: "$50",
      status: "Pending",
      type: "Event",
    },
    {
      id: 103,
      title: "Bachata Bootcamp",
      instructor: "Diego Ramos",
      price: "$15",
      status: "Rejected",
      type: "Program",
    },
    {
      id: 104,
      title: "Brobgram",
      instructor: "Maria Lopez",
      price: "$10",
      status: "Approve",
      type: "Program",
    },
  ];

  const filteredData = data.filter(
    (item) =>
      (filter === "All" || item.type === filter) &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="marketplace-container">
      <h2 className="marketplace-header">Marketplace</h2>
      <div className="marketplace-controls">
        <div className="filter-buttons">
          {["All", "Program", "Event"].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="🔍 Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="marketplace-search"
        />
        <button
          className="create-listing-btn"
          onClick={() => {
            setShowModal(true);
            setSelectedType(null);
          }}
        >
          Create Listing
        </button>
      </div>

      <table className="marketplace-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name / Title</th>
            <th>Instructor / Organizer</th>
            <th>Price</th>
            <th>Status</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.instructor}</td>
              <td>{item.price}</td>
              <td>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>
              <td>{item.type}</td>
              <td>...</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-listing">
            <h2>Create New Listing</h2>
            <p>What do you want to list?</p>

            <div className="modal-options">
              <button
                className={`modal-option ${
                  selectedType === "Program" ? "active" : ""
                }`}
                onClick={() => setSelectedType("Program")}
              >
                Program
              </button>
              <button
                className={`modal-option ${
                  selectedType === "Event" ? "active" : ""
                }`}
                onClick={() => setSelectedType("Event")}
              >
                Event
              </button>
            </div>

            {selectedType && (
              <div className="modal-dropdown">
                <label>
                  {`Choose from existing ${
                    selectedType === "Program" ? "Programs" : "Events"
                  }`}
                </label>
                <select defaultValue="">
                  <option value="" disabled>
                    Select...
                  </option>
                  {data
                    .filter((item) => item.type === selectedType)
                    .map((item) => (
                      <option key={item.id}>{item.title}</option>
                    ))}
                </select>
              </div>
            )}

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              {selectedType && (
                <button
                  className="apply-btn"
                  onClick={() => {
                    alert(`Applied for ${selectedType}`);
                    setShowModal(false);
                  }}
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
