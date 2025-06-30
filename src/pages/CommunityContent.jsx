// // src/pages/CommunityContent.jsx
// import React, { useState } from "react";
// import "../styles/CommunityContent.css";

// const CommunityContent = () => {
//   const [search, setSearch] = useState("");

//   const dummyData = [
//     {
//       id: 1,
//       image: "https://randomuser.me/api/portraits/men/32.jpg",
//       caption: "Love this CHallenge",
//       postedBy: "Ananya R.",
//       likes: 150,
//       status: "Published",
//       date: "May 1",
//     },
//     {
//       id: 2,
//       image: "https://randomuser.me/api/portraits/men/42.jpg",
//       caption: "Love this CHallenge",
//       postedBy: "Dev P.",
//       likes: 98,
//       status: "Draft",
//       date: "Apr 29",
//     },
//     {
//       id: 3,
//       image: "https://randomuser.me/api/portraits/women/52.jpg",
//       caption: "Love this CHallenge",
//       postedBy: "Maria K.",
//       likes: 87,
//       status: "Flagged",
//       date: "Apr 23",
//     },
//     {
//       id: 4,
//       image: "https://randomuser.me/api/portraits/women/62.jpg",
//       caption: "Love this CHallenge",
//       postedBy: "Mira S.",
//       likes: 112,
//       status: "Published",
//       date: "May 2",
//     },
//     {
//       id: 5,
//       image: "https://randomuser.me/api/portraits/women/64.jpg",
//       caption: "Love this CHallenge",
//       postedBy: "Rajra S.",
//       likes: 134,
//       status: "Published",
//       date: "June 2",
//     },
//   ];

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "Published": return "status published";
//       case "Draft": return "status draft";
//       case "Flagged": return "status flagged";
//       default: return "status";
//     }
//   };

//   return (
//     <div className="community-content">
//       <div className="top-bar">
//         <h1>Community Content</h1>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search Content"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button>⋮</button>
//         </div>
//       </div>

//       <div className="tabs">
//         <button className="active">All</button>
//         <button>Videos</button>
//         <button>Images</button>
//       </div>

//       <div className="filters">
//         <button>⚙ Filters</button>
//       </div>

//       <div className="content-table">
//         <table>
//           <thead>
//             <tr>
//               <th></th>
//               <th>Caption</th>
//               <th>Posted By</th>
//               <th>Likes</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dummyData.map((item) => (
//               <tr key={item.id}>
//                 <td><input type="checkbox" /></td>
//                 <td>
//                   <div className="caption-cell">
//                     <img src={item.image} alt="content" />
//                     <span>{item.caption}</span>
//                   </div>
//                 </td>
//                 <td>{item.postedBy}</td>
//                 <td>{item.likes}</td>
//                 <td><span className={getStatusClass(item.status)}>{item.status}</span></td>
//                 <td>{item.date}</td>
//                 <td>⋮</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CommunityContent;

import React, { useState } from "react";
import "../styles/CommunityContent.css";

const CommunityContent = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="community-content-page">
      <div className="community-header">
        <h1>Community Content</h1>
      </div>

      <div className="filters-bar">
        <div className="filters-left">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Video">Video</option>
            <option value="Image">Image</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>

        <div className="filters-right">
          <input
            type="text"
            placeholder="Search Content"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="active">All</button>
        <button>Videos</button>
        <button>Images</button>
      </div>

      {/* Dummy table below - replace with mapped backend data later */}
      <div className="content-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Caption</th>
              <th>Posted By</th>
              <th>Likes</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Static rows - replace with backend data */}
            <tr>
              <td>
                <input type="checkbox" />
              </td>
              <td className="content-caption">
                <img
                  src="https://dummyimage.com/48x48/000/fff"
                  alt="content"
                />
                <span>Love this Challenge</span>
              </td>

              <td>Ananya R.</td>
              <td>150</td>
              <td>
                <span className="status-tag status-published">Published</span>
              </td>
              <td>May 1</td>
              <td className="actions">⋮</td>
            </tr>
            {/* Add more rows here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityContent;
