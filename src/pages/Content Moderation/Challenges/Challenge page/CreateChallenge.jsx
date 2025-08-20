import React, { useState, useEffect } from "react";
import "./CreateChallenge.css";
import CreateChallengeModal from "../Challenge modal/CreateChallengeModal";
import { X } from "lucide-react";
import { getChallengesService } from "../../../../services/challenge.service";

const CreateChallenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const response = await getChallengesService();
        setChallenges(response.data.challenges);
      } catch (error) {
        console.error("Failed to load challenges", error);
      }
    };

    loadChallenges();
  }, []);

  // Map API data to expected format for UI display
  const processedChallenges = challenges.map((ch) => ({
    ...ch,
    host: "Admin",
    duration: ch.tasks?.length || 0,
    participants: 0,
    status: "Published", // or use actual field when available
    image: ch.image_url,
  }));

  return (
    <div className="create-challenge-page">
      <div className="create-challenge-header">
        <h1>Challenge Management</h1>
        <button
          className="create-challenge-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Challenge
        </button>
      </div>

      <div className="create-challenge-table">
        <table>
          <thead>
            <tr>
              {/* <th></th> */}
              <th>Title</th>
              <th>Host</th>
              <th>Duration</th>
              <th>Participants</th>
              <th>Status</th>
              {/* <th></th> */}
            </tr>
          </thead>
          <tbody>
            {processedChallenges.map((challenge, index) => (
              <tr
                key={index}
                onClick={() => setSelectedChallenge(challenge)}
                className="clickable-row"
              >
                <td>
                  <span role="img" className="emoji">
                    🏆
                  </span>{" "}
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
                {/* <td></td> */}
              </tr>
            ))}
            {processedChallenges.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No challenges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CreateChallengeModal onClose={() => setIsModalOpen(false)} />
      )}

      {selectedChallenge && (
        <div
          className="challenge-popup-overlay"
          onClick={() => setSelectedChallenge(null)}
        >
          <div
            className="challenge-popup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h2>{selectedChallenge.title}</h2>
              <X
                className="popup-close"
                onClick={() => setSelectedChallenge(null)}
              />
            </div>
            <div className="popup-content">
              <div className="popup-image-container">
                <img
                  src={selectedChallenge.image}
                  alt={selectedChallenge.title}
                />
              </div>
              <div className="popup-details">
                <div className="detail-item">
                  <span className="detail-label">Host:</span>
                  <span className="detail-value">{selectedChallenge.host}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">
                    {selectedChallenge.duration} Days
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Participants:</span>
                  <span className="detail-value">
                    {selectedChallenge.participants}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span
                    className={`detail-value status ${selectedChallenge.status.toLowerCase()}`}
                  >
                    {selectedChallenge.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateChallenge;
