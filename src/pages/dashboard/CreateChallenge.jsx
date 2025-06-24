// CreateChallenge.jsx
import React, { useState } from "react";
import "../../styles/CreateChallenge.css"; // Updated CSS filename
import CreateChallengeModal from "./CreateChallengeModal"; // You'll provide this next

const dummyChallenges = [
  {
    title: "7-Day Sala Sprint",
    host: "Ananya R.",
    duration: 7,
    participants: 180,
    status: "Published",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "April Bachata Bash",
    host: "Dev P.",
    duration: 8,
    participants: 200,
    status: "Draft",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "Spins Mastery",
    host: "Maria K.",
    duration: 9,
    participants: 130,
    status: "Flagged",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "Groove Challenge",
    host: "Mira S.",
    duration: 10,
    participants: 12,
    status: "Published",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "7-Day Sala Sprint",
    host: "Rajra S.",
    duration: 4,
    participants: 123,
    status: "Published",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "7-Day Sala Sprint",
    host: "Rajra S.",
    duration: 7,
    participants: 22,
    status: "Published",
    image: "https://via.placeholder.com/50x50"
  }
];

const CreateChallenge = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [participantsFilter, setParticipantsFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterChallenges = (challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDuration = (() => {
      const d = challenge.duration;
      switch (durationFilter) {
        case "0-5": return d >= 0 && d <= 5;
        case "5-10": return d > 5 && d <= 10;
        case "10-20": return d > 10 && d <= 20;
        case "20-50": return d > 20 && d <= 50;
        case "50+": return d > 50;
        default: return true;
      }
    })();

    const matchesParticipants = (() => {
      const p = challenge.participants;
      switch (participantsFilter) {
        case "0-20": return p >= 0 && p <= 20;
        case "20-50": return p > 20 && p <= 50;
        case "50-100": return p > 50 && p <= 100;
        case "100-500": return p > 100 && p <= 500;
        case "500-1k": return p > 500 && p <= 1000;
        case "1k+": return p > 1000;
        default: return true;
      }
    })();

    const matchesStatus = !statusFilter || challenge.status === statusFilter;

    return matchesSearch && matchesDuration && matchesParticipants && matchesStatus;
  };

  const filteredChallenges = dummyChallenges.filter(filterChallenges);

  return (
    <div className="create-challenge-page">
      <div className="create-challenge-header">
        <h1>Challenges</h1>
        <button className="create-challenge-btn" onClick={() => setIsModalOpen(true)}>
          + Create Challenge
        </button>
      </div>

      <div className="create-challenge-filters">
        <input
          className="create-challenge-search"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select onChange={(e) => setDurationFilter(e.target.value)} defaultValue="">
          <option value="">All Durations</option>
          <option value="0-5">0-5 Days</option>
          <option value="5-10">5-10 Days</option>
          <option value="10-20">10-20 Days</option>
          <option value="20-50">20-50 Days</option>
          <option value="50+">50+ Days</option>
        </select>

        <select onChange={(e) => setParticipantsFilter(e.target.value)} defaultValue="">
          <option value="">All Participants</option>
          <option value="0-20">0-20</option>
          <option value="20-50">20-50</option>
          <option value="50-100">50-100</option>
          <option value="100-500">100-500</option>
          <option value="500-1k">500-1k</option>
          <option value="1k+">1k+</option>
        </select>

        <select onChange={(e) => setStatusFilter(e.target.value)} defaultValue="">
          <option value="">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Flagged">Flagged</option>
        </select>
      </div>

      <div className="create-challenge-table">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Title</th>
              <th>Host</th>
              <th>Duration</th>
              <th>Participants</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredChallenges.map((challenge, index) => (
              <tr key={index}>
                <td><input type="checkbox" /></td>
                <td>
                  <span role="img" className="emoji">🏆</span>
                  {challenge.title}
                </td>
                <td>{challenge.host}</td>
                <td>{challenge.duration} Days</td>
                <td>{challenge.participants}</td>
                <td>
                  <span className={`status ${challenge.status.toLowerCase()}`}>
                    {challenge.status}
                  </span>
                </td>
                <td className="actions">⋯</td>
              </tr>
            ))}
            {filteredChallenges.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>No challenges found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CreateChallengeModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default CreateChallenge;
