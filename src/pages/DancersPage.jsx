import React, { useState, useEffect } from "react";
import "../styles/DancersPage.css";
import { FaSearch } from "react-icons/fa";
import DancerDetailModal from "../components/DancerDetailModal";
import EditModal from "../components/EditModal";
import CalendarModal from "../components/CalendarModal";
import PreferenceModal from "../components/PreferenceModal";
import ResetPasswordModal from "../components/ResetPasswordModal";

const dancers = [
  {
    id: 101,
    name: "Maya Rivers",
    email: "maya.rivers@example.com",
    subscription: "Douceur",
    level: "Intermediate",
    status: "Active",
    avatar: "https://i.pravatar.cc/40?img=1",
    referrals: 18, // Silver
  },
  {
    id: 102,
    name: "Leo Martinez",
    email: "leo.martinez@example.com",
    subscription: "Ginga",
    level: "Beginner",
    status: "Active",
    avatar: "https://i.pravatar.cc/40?img=2",
    referrals: 7, // Bronze
  },
  {
    id: 103,
    name: "Aisha Kapoor",
    email: "aisha.k@example.com",
    subscription: "Fiver",
    level: "Advanced",
    status: "Active",
    avatar: "https://i.pravatar.cc/40?img=3",
    referrals: 104, // Diamond
  },
  {
    id: 104,
    name: "Henry Smith",
    email: "henry@example.com",
    subscription: "Fiver",
    level: "Advanced",
    status: "Active",
    avatar: "https://i.pravatar.cc/40?img=4",
    referrals: 38, // Gold
  },
  {
    id: 105,
    name: "Caroline Johnson",
    email: "caroline.j@example.com",
    subscription: "Fiver",
    level: "Advanced",
    status: "Active",
    avatar: "https://i.pravatar.cc/40?img=5",
    referrals: 9999, // Star
  },
  {
    id: 106,
    name: "James Smith",
    email: "james.smith@example.com",
    subscription: "Fiver",
    level: "Advanced",
    status: "Active",
    avatar: "https://i.pravatar.cc/40?img=6",
    referrals: 25000, // Legendary
  },
];

const DancersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDancer, setSelectedDancer] = useState(null);
  const [openModal, setOpenModal] = useState("");
  const [dropdownDancerId, setDropdownDancerId] = useState(null);

  const filteredDancers = dancers.filter(
    (dancer) =>
      dancer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (subscriptionFilter === "" ||
        dancer.subscription === subscriptionFilter) &&
      (levelFilter === "" || dancer.level === levelFilter) &&
      (statusFilter === "" || dancer.status === statusFilter)
  );

  const handleOptionClick = (type, dancer) => {
    setSelectedDancer(dancer);
    setOpenModal(type);
    setDropdownDancerId(null);
  };

  const closeModal = () => {
    setOpenModal("");
    setSelectedDancer(null);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown")) {
      setDropdownDancerId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStudentBadge = (referrals) => {
    if (referrals >= 10000) return "🏆 Legendary";
    if (referrals >= 1000) return "🌟 Star";
    if (referrals >= 100) return "💎 Diamond";
    if (referrals >= 50) return "🎯 Platinum";
    if (referrals >= 30) return "🥇 Gold";
    if (referrals >= 15) return "🥈 Silver";
    if (referrals >= 5) return "🥉 Bronze";
    return "🎒 Newbie";
  };

  return (
    <div className="dancers-container">
      <div className="header">
        <h2>Dancers</h2>
      </div>

      <div className="top-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <select
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
          >
            <option value="">All Subscriptions</option>
            <option value="Douceur">Douceur</option>
            <option value="Ginga">Ginga</option>
            <option value="Fiver">Fiver</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <table className="dancers-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subscription</th>
            <th>Dance Level</th>
            <th>Status</th>
            <th>Badge</th> {/* based on referrals */}
            <th>Referrals</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filteredDancers.map((dancer, index) => (
            <tr key={dancer.id}>
              <td>{dancer.id}</td>
              <td
                className="user-info clickable"
                onClick={() => handleOptionClick("detail", dancer)}
              >
                <img src={dancer.avatar} alt="avatar" />
                {dancer.name}
              </td>
              <td>{dancer.email}</td>
              <td>
                <span className={`badge ${dancer.subscription.toLowerCase()}`}>
                  {dancer.subscription}
                </span>
              </td>
              <td>{dancer.level}</td>
              <td>{dancer.status}</td>
              <td>{getStudentBadge(dancer.referrals)}</td> {/* badge */}
              <td>{dancer.referrals}</td> {/* referrals */}
              <td className="menu">
                <div className="dropdown">
                  <span
                    onClick={() =>
                      setDropdownDancerId(
                        dropdownDancerId === dancer.id ? null : dancer.id
                      )
                    }
                  >
                    ⋮
                  </span>
                  {dropdownDancerId === dancer.id && (
                    <div
                      className={`dropdown-menu ${
                        index >= filteredDancers.length - 3 ? "dropdown-up" : ""
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* <div
                        className="edit"
                        onClick={() => handleOptionClick("edit", dancer)}
                      >
                        ✏️ Edit
                      </div> */}
                      <div
                        onClick={() => handleOptionClick("calendar", dancer)}
                      >
                        🗓️ Calendar
                      </div>
                      <div
                        onClick={() => handleOptionClick("preferences", dancer)}
                      >
                        🎯 Preferences
                      </div>
                      <div onClick={() => handleOptionClick("reset", dancer)}>
                        🔐 Reset Pass.
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal === "detail" && (
        <DancerDetailModal dancer={selectedDancer} onClose={closeModal} />
      )}
      {openModal === "edit" && (
        <EditModal dancer={selectedDancer} onClose={closeModal} />
      )}
      {openModal === "calendar" && (
        <CalendarModal dancer={selectedDancer} onClose={closeModal} />
      )}
      {openModal === "preferences" && (
        <PreferenceModal dancer={selectedDancer} onClose={closeModal} />
      )}
      {openModal === "reset" && (
        <ResetPasswordModal dancer={selectedDancer} onClose={closeModal} />
      )}
    </div>
  );
};

export default DancersPage;
