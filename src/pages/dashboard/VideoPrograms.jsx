import React, { useState } from "react";
import "../../styles/VideoPrograms.css";
import CreateProgramModal from "./CreateProgramModal";

const dummyData = [
  {
    title: "Intro to Hip-Hop",
    host: "Ananya R.",
    level: "Beginner",
    videos: 10,
    status: "Published",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "Bachata Basics",
    host: "Dev P.",
    level: "Advance",
    videos: 7,
    status: "Draft",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "Spins Mastery",
    host: "Maria K.",
    level: "Advance",
    videos: 12,
    status: "Flagged",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "Groove Challenge",
    host: "Mira S.",
    level: "Beginner",
    videos: 3,
    status: "Published",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "7-Day Sala Sprint",
    host: "Rajra S.",
    level: "Beginner",
    videos: 8,
    status: "Published",
    image: "https://via.placeholder.com/50x50"
  },
  {
    title: "7-Day Sala Sprint",
    host: "Rajra S.",
    level: "Advance",
    videos: 14,
    status: "Published",
    image: "https://via.placeholder.com/50x50"
  },
];

const VideoPrograms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [videoFilter, setVideoFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const instructorOptions = ["Ananya R.", "Dev P.", "Maria K.", "Mira S.", "Rajra S."];
  const danceStyles = ["Hip-Hop", "Bachata", "Salsa", "Contemporary", "Jazz", "Ballet"];

  const filterVideos = (video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !levelFilter || video.level === levelFilter;
    const matchesStatus = !statusFilter || video.status === statusFilter;
    const matchesVideoCount = (() => {
      const v = video.videos;
      switch (videoFilter) {
        case "0": return v === 0;
        case "0-10": return v > 0 && v <= 10;
        case "10-30": return v > 10 && v <= 30;
        case "30-50": return v > 30 && v <= 50;
        case "50-100": return v > 50 && v <= 100;
        case "100+": return v > 100;
        default: return true;
      }
    })();

    return matchesSearch && matchesLevel && matchesStatus && matchesVideoCount;
  };

  const filteredPrograms = dummyData.filter(filterVideos);

  return (
    <div className="video-programs-page">
      <div className="header">
        <h1>Video Programs</h1>
        <button className="create-video-btn" onClick={() => setIsModalOpen(true)}>
          + Create Video Program
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select onChange={(e) => setLevelFilter(e.target.value)} defaultValue="">
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advance">Advance</option>
          <option value="Professional">Professional</option>
        </select>

        <select onChange={(e) => setVideoFilter(e.target.value)} defaultValue="">
          <option value="">All Videos</option>
          <option value="0">0</option>
          <option value="0-10">0 - 10</option>
          <option value="10-30">10 - 30</option>
          <option value="30-50">30 - 50</option>
          <option value="50-100">50 - 100</option>
          <option value="100+">100+</option>
        </select>

        <select onChange={(e) => setStatusFilter(e.target.value)} defaultValue="">
          <option value="">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Flagged">Flagged</option>
        </select>
      </div>

      <div className="video-programs-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Program Title</th>
              <th>Host</th>
              <th>Level</th>
              <th>Videos</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((prog, index) => (
              <tr key={index}>
                <td><input type="checkbox" /></td>
                <td className="program-title">
                  <img src={prog.image} alt={prog.title} />
                  {prog.title}
                </td>
                <td>{prog.host}</td>
                <td>{prog.level}</td>
                <td>{prog.videos}</td>
                <td>
                  <span className={`status ${prog.status.toLowerCase()}`}>
                    {prog.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredPrograms.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No programs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CreateProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instructorOptions={instructorOptions}
        danceStyles={danceStyles}
      />
    </div>
  );
};

export default VideoPrograms;
