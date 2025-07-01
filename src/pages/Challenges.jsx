import React, { useState } from "react";
import "../styles/Challenges.css";
import { X } from "lucide-react";

const Challenges = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState(null);


  const challenges = [
    {
      id: 1,
      image: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
      title: "7-Day Sala Sprint",
      host: "Ananya R.",
      duration: "7 Days",
      participants: 180,
      status: "Published",
    },
    {
      id: 2,
      image: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
      title: "April Bachata Bash",
      host: "Dev P.",
      duration: "8 Days",
      participants: 200,
      status: "Draft",
    },
    {
      id: 3,
      image: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
      title: "Spins Mastery",
      host: "Maria K.",
      duration: "9 Days",
      participants: 130,
      status: "Flagged",
    },
  ];

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesStatus =
      statusFilter === "All" || challenge.status === statusFilter;
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="challenges-container">
      <div className="challenges-header">
        <h1>Challenges</h1>
        <div className="challenges-actions">
          <div className="challenges-search">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="challenges-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Flagged">Flagged</option>
          </select>
          <button className="create-challenge-btn">+ Create Challenge</button>
        </div>
      </div>

      <table className="challenge-table">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Host</th>
            <th>Duration</th>
            <th>Participants</th>
            <th>Status</th>
            <th className="challenge-actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredChallenges.map((item) => (
            <tr
  key={item.id}
  onClick={() => setSelectedChallenge(item)}
  className="clickable-row"
>

              <td>
                <input type="checkbox" />
              </td>
              <td>
                <div className="challenge-title">
                  <img src={item.image} alt="challenge" />
                  {item.title}
                </div>
              </td>
              <td>{item.host}</td>
              <td>{item.duration}</td>
              <td>{item.participants}</td>
              <td>
                <span
                  className={`status-label ${
                    item.status === "Published"
                      ? "status-published"
                      : item.status === "Draft"
                      ? "status-draft"
                      : "status-flagged"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="challenge-actions">⋯</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedChallenge && (
  <div
    className="challenge-popup-overlay"
    onClick={() => setSelectedChallenge(null)}
  >
    <div className="challenge-popup-modal" onClick={(e) => e.stopPropagation()}>
      <div className="popup-header">
        <h2>{selectedChallenge.title}</h2>
        <X className="popup-close" onClick={() => setSelectedChallenge(null)} />
      </div>
      <img src={selectedChallenge.image} alt={selectedChallenge.title} />
      <p><strong>Host:</strong> {selectedChallenge.host}</p>
      <p><strong>Duration:</strong> {selectedChallenge.duration}</p>
      <p><strong>Participants:</strong> {selectedChallenge.participants}</p>
      <p><strong>Status:</strong> {selectedChallenge.status}</p>
    </div>
  </div>
)}

    </div>
    
  );
};

export default Challenges;
