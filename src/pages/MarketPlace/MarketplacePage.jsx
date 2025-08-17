// import React, { useState, useEffect } from "react";
// import "./Marketplacepage.css";
// import {
//   getMarketplacePrograms,
//   getPublishedEvents,
//   getProgramPurchases,
// } from "../../services/marketplace.service.js";

// const MarketplacePage = () => {
//   const [filter, setFilter] = useState("Program");
//   const [search, setSearch] = useState("");

//   const [programs, setPrograms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [selectedType, setSelectedType] = useState(null);

//   // Program details modal
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [purchases, setPurchases] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loadingPurchases, setLoadingPurchases] = useState(false);

//   // Event details modal ✅
//   const [showEventModal, setShowEventModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   // Fetch programs or events
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         if (filter === "Program") {
//           const res = await getMarketplacePrograms(1, 20);
//           setPrograms(res.programs || []);
//         } else if (filter === "Event") {
//           const res = await getPublishedEvents(1, 20);
//           setEvents(res.events || []);
//         }
//       } catch (err) {
//         console.error("❌ Error loading marketplace:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [filter]);

//   // Filter + search
//   const filteredData =
//     filter === "Program"
//       ? programs.filter((p) =>
//           p.title.toLowerCase().includes(search.toLowerCase())
//         )
//       : events.filter((e) =>
//           e.event_title.toLowerCase().includes(search.toLowerCase())
//         );

//   // Open program details (fetch purchases)
//   const openProgramDetails = async (program) => {
//     setSelectedProgram(program);
//     setShowDetails(true);
//     setLoadingPurchases(true);
//     try {
//       const res = await getProgramPurchases(program.program_id, 1, 20);
//       setPurchases(res.purchases || []);
//       setStats(res.statistics || {});
//     } catch (err) {
//       console.error("❌ Error fetching purchases:", err);
//     } finally {
//       setLoadingPurchases(false);
//     }
//   };

//   return (
//     <div className="marketplace-container">
//       <h2 className="marketplace-header">Marketplace</h2>
//       <div className="marketplace-controls">
//         <div className="filter-buttons">
//           {["Program", "Event"].map((item) => (
//             <button
//               key={item}
//               className={filter === item ? "active" : ""}
//               onClick={() => setFilter(item)}
//             >
//               {item}
//             </button>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="🔍 Search"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="marketplace-search"
//         />
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="marketplace-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name / Title</th>
//               <th>Instructor / Organizer</th>
//               <th>Price</th>
//               <th>Status</th>
//               <th>Type</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((item, index) => (
//               <tr key={index}>
//                 <td>
//                   {filter === "Program" ? item.program_id : item.event_id}
//                 </td>
//                 <td
//                   className="clickable"
//                   onClick={() => {
//                     setSelectedEvent(item);
//                     setShowEventModal(true);
//                   }}
//                 >
//                   {filter === "Program" ? item.title : item.event_title}
//                 </td>

//                 <td>
//                   {filter === "Program"
//                     ? item.instructor_name
//                     : item.organizer?.name}
//                 </td>
//                 <td>
//                   {filter === "Program" ? item.price : item.price || "Free"}
//                 </td>
//                 <td>
//                   <span
//                     className={`status ${
//                       filter === "Program"
//                         ? "approved"
//                         : item.status?.toLowerCase()
//                     }`}
//                   >
//                     {filter === "Program" ? "Approved" : item.status}
//                   </span>
//                 </td>
//                 <td>{filter}</td>
//                 <td>...</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Event Modal */}
//       {showEventModal && selectedEvent && (
//         <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
//           <div
//             className="modal-listing wide"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2>{selectedEvent.event_title} - Details</h2>
//             <p>
//               <strong>Organizer:</strong> {selectedEvent.organizer?.name} |
//               <strong> Price:</strong> {selectedEvent.price || "Free"}
//             </p>

//             <p>
//               <strong>Status:</strong> {selectedEvent.status}
//             </p>
//             <p>
//               <strong>Date:</strong>{" "}
//               {new Date(selectedEvent.start_date).toLocaleDateString()} -{" "}
//               {new Date(selectedEvent.end_date).toLocaleDateString()}
//             </p>
//             <p>
//               <strong>Description:</strong> {selectedEvent.description}
//             </p>

//             <div className="modal-buttons">
//               <button
//                 className="cancel-btn"
//                 onClick={() => setShowEventModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Program Purchases Modal */}
//       {showDetails && selectedProgram && (
//         <div className="modal-overlay" onClick={() => setShowDetails(false)}>
//           <div
//             className="modal-listing wide"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2>{selectedProgram.title} - Purchases</h2>
//             <p>
//               <strong>Instructor:</strong> {selectedProgram.instructor_name} |
//               <strong> Price:</strong> {selectedProgram.price}
//             </p>

//             {loadingPurchases ? (
//               <p>Loading purchases...</p>
//             ) : purchases.length === 0 ? (
//               <p>No purchases found.</p>
//             ) : (
//               <>
//                 <table className="marketplace-table small">
//                   <thead>
//                     <tr>
//                       <th>User</th>
//                       <th>Email</th>
//                       <th>Amount</th>
//                       <th>Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {purchases.map((p, idx) => (
//                       <tr key={idx}>
//                         <td>{p.user?.name}</td>
//                         <td>{p.user?.email}</td>
//                         <td>{p.amount}</td>
//                         <td>{new Date(p.created_at).toLocaleDateString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {/* Statistics */}
//                 {stats && (
//                   <div className="stats-box">
//                     <p>
//                       <strong>Total Purchases:</strong>{" "}
//                       {stats.total_purchases || purchases.length}
//                     </p>
//                     <p>
//                       <strong>Total Revenue:</strong> {stats.total_revenue || 0}
//                     </p>
//                   </div>
//                 )}
//               </>
//             )}

//             <div className="modal-buttons">
//               <button
//                 className="cancel-btn"
//                 onClick={() => setShowDetails(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MarketplacePage;
import React, { useState, useEffect } from "react";
import "./Marketplacepage.css";
import {
  getMarketplacePrograms,
  getPublishedEvents,
  getProgramPurchases,
} from "../../services/marketplace.service.js";

const MarketplacePage = () => {
  const [filter, setFilter] = useState("Program");
  const [search, setSearch] = useState("");

  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  // Program details modal
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  // Fetch programs or events
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (filter === "Program") {
          const res = await getMarketplacePrograms(1, 20);
          setPrograms(res.programs || []);
        } else if (filter === "Event") {
          const res = await getPublishedEvents(1, 20);
          setEvents(res.events || []);
        }
      } catch (err) {
        console.error("❌ Error loading marketplace:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  // Filter + search
  const filteredData =
    filter === "Program"
      ? programs.filter((p) =>
          p.title.toLowerCase().includes(search.toLowerCase())
        )
      : events.filter((e) =>
          e.event_title.toLowerCase().includes(search.toLowerCase())
        );

  // Open program details (fetch purchases)
  const openProgramDetails = async (program) => {
    setSelectedProgram(program);
    setShowDetails(true);
    setLoadingPurchases(true);
    try {
      const res = await getProgramPurchases(program.program_id, 1, 20);
      setPurchases(res.purchases || []);
      setStats(res.statistics || {});
    } catch (err) {
      console.error("❌ Error fetching purchases:", err);
    } finally {
      setLoadingPurchases(false);
    }
  };

  return (
    <div className="marketplace-container">
      <h2 className="marketplace-header">Marketplace</h2>
      <div className="marketplace-controls">
        <div className="filter-buttons">
          {["Program", "Event"].map((item) => (
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

      {loading ? (
        <p>Loading...</p>
      ) : (
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
                <td>
                  {filter === "Program" ? item.program_id : item.event_id}
                </td>
                <td
                  className={filter === "Program" ? "clickable" : ""}
                  onClick={() =>
                    filter === "Program" ? openProgramDetails(item) : null
                  }
                >
                  {filter === "Program" ? item.title : item.event_title}
                </td>
                <td>
                  {filter === "Program"
                    ? item.instructor_name
                    : item.organizer?.name}
                </td>
                <td>
                  {filter === "Program" ? item.price : item.price || "Free"}
                </td>
                <td>
                  <span
                    className={`status ${
                      filter === "Program"
                        ? "approved"
                        : item.status?.toLowerCase()
                    }`}
                  >
                    {filter === "Program" ? "Approved" : item.status}
                  </span>
                </td>
                <td>{filter}</td>
                <td>...</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create Listing Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-listing" onClick={(e) => e.stopPropagation()}>
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
                  {(selectedType === "Program" ? programs : events).map(
                    (item) => (
                      <option
                        key={
                          selectedType === "Program"
                            ? item.program_id
                            : item.event_id
                        }
                      >
                        {selectedType === "Program"
                          ? item.title
                          : item.event_title}
                      </option>
                    )
                  )}
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

      {/* Program Purchases Modal */}
      {showDetails && selectedProgram && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div
            className="modal-listing wide"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedProgram.title} - Purchases</h2>
            <p>
              <strong>Instructor:</strong> {selectedProgram.instructor_name} |
              <strong> Price:</strong> {selectedProgram.price}
            </p>

            {loadingPurchases ? (
              <p>Loading purchases...</p>
            ) : purchases.length === 0 ? (
              <p>No purchases found.</p>
            ) : (
              <>
                <table className="marketplace-table small">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.user?.name}</td>
                        <td>{p.user?.email}</td>
                        <td>{p.amount}</td>
                        <td>{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Statistics */}
                {stats && (
                  <div className="stats-box">
                    <p>
                      <strong>Total Purchases:</strong>{" "}
                      {stats.total_purchases || purchases.length}
                    </p>
                    <p>
                      <strong>Total Revenue:</strong> {stats.total_revenue || 0}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
