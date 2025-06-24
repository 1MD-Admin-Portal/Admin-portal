import React, { useState } from "react";
import "../styles/Marketplacepage.css";

const MarketplacePage = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

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
          {['All', 'Program', 'Event'].map((item) => (
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
        <button className="create-listing-btn">Create Listing</button>

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
    </div>
  );
};

export default MarketplacePage;
