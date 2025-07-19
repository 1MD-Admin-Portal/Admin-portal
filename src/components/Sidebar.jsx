// // import React from "react";
// // import {
// //   Home as HomeIcon,
// //   Users,
// //   Video,
// //   Flag,
// //   Activity,
// //   DollarSign,
// //   Bell,
// //   Cog,
// //   LogOut,
// // } from "lucide-react";
// // import "../styles/Sidebar.css";
// // import { NavLink } from "react-router-dom";

// // const Sidebar = () => {
// //   return (
// //     <aside className="sidebar">
// //       <div className="sidebar-header">
// //         <h2>Dance with me</h2>
// //       </div>
// //       <nav className="menu">
// //         <div className="menu-section">
// //           <p className="menu-section-title">MAIN</p>
// //           <ul>
// //             <li><NavLink to="/home"><HomeIcon size={18} /> Dashboard</NavLink></li>
// //             <li><NavLink to="/users"><Users size={18} /> Users</NavLink></li>
// //             <li><NavLink to="/content"><Video size={18} /> Community Content</NavLink></li>
// //             <li><NavLink to="/programs"><Flag size={18} /> Program Management</NavLink></li>
// //             <li><NavLink to="/challenges"><Activity size={18} /> Challenges</NavLink></li>
// //             <li><NavLink to="/moderation"><Video size={18} /> Class Moderation</NavLink></li>
// //             <li><NavLink to="/events"><Video size={18} /> Events</NavLink></li>
// //             <li><NavLink to="/marketplace"><DollarSign size={18} /> Marketplace</NavLink></li>
// //             <li><NavLink to="/earnings"><DollarSign size={18} /> Earnings & Payouts</NavLink></li>
// //             <li><NavLink to="/logs"><Activity size={18} /> Access Logs</NavLink></li>
// //             <li><NavLink to="/ads"><Video size={18} /> Ads Management</NavLink></li>
// //           </ul>
// //         </div>
// //         <div className="menu-section">
// //           <p className="menu-section-title">SETTINGS</p>
// //           <ul>
// //             <li><NavLink to="/notifications"><Bell size={18} /> Notification</NavLink></li>
// //             <li><NavLink to="/settings"><Cog size={18} /> Settings</NavLink></li>
// //           </ul>
// //         </div>
// //         <div className="logout">
// //           <NavLink to="/logout"><LogOut size={18} /> Logout</NavLink>
// //         </div>
// //       </nav>
// //     </aside>
// //   );
// // };

// // export default Sidebar;

// import React, { useState } from "react";
// import {
//   Home as HomeIcon,
//   Users,
//   Video,
//   DollarSign,
//   Activity,
//   Bell,
//   Cog,
//   LogOut,
//   Flag
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import "../styles/Sidebar.css";

// const Sidebar = () => {
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);

//   const toggleUserDropdown = () => {
//     setUserDropdownOpen(!userDropdownOpen);
//   };

//   return (
// <aside className="sidebar">
//   <div className="sidebar-content">
//     <div className="sidebar-header">
//       <h2>Dance with me</h2>
//     </div>
//     <nav className="menu">
//       <div className="menu-section">
//         <p className="menu-section-title">MAIN</p>
//         <ul>
//           <li><Link to="/home"><HomeIcon size={18} /> Dashboard</Link></li>
//           <li onClick={toggleUserDropdown} className="has-submenu">
//             <div className="menu-item-with-arrow">
//               <Users size={18} />
//               <span>Users</span>
//               <span className={`arrow ${userDropdownOpen ? "open" : ""}`}>
//   {userDropdownOpen ? "▲" : "▼"}
// </span>

//             </div>
//             {userDropdownOpen && (
//               <ul className="submenu">
//                 <li><Link to="/users/Dancers">Dancers</Link></li>
//                 <li><Link to="/users/Professors">Professors</Link></li>
//               </ul>
//             )}
//           </li>
//           <li><Link to="/CommunityContent"><Video size={18} /> Community Content</Link></li>
//           <li><Link to="/ProgramManagement"><Flag size={18} /> Program Management</Link></li>
//           <li><Link to="/challenges"><Activity size={18} /> Challenges</Link></li>
//           <li><Link to="/ClassModeration"><Video size={18} /> Class Moderation</Link></li>
//           <li><Link to="/EventsPage"><Video size={18} /> Events</Link></li>
//           <li><Link to="/MarketplacePage"><DollarSign size={18} /> Marketplace</Link></li>
//           <li><Link to="/PayoutsPage"><DollarSign size={18} /> Earnings & Payouts</Link></li>
//           <li><Link to="/AccessLogs"><Activity size={18} /> Access Logs</Link></li>
//           <li><Link to="/AdsManagement"><Video size={18} /> Ads Management</Link></li>
//         </ul>
//       </div>
//       <div className="menu-section">
//         <p className="menu-section-title">SETTINGS</p>
//         <ul>
//           <li><Link to="/NotificationPage"><Bell size={18} /> Notification</Link></li>
//           <li><Link to="/SettingsPage"><Cog size={18} /> Settings</Link></li>
//         </ul>
//       </div>
//     </nav>
//   </div>
//   <div className="logout">
//     <Link to="/"><LogOut size={18} /> Logout</Link>
//   </div>
// </aside>

//   );
// };

// export default Sidebar;

// import React, { useState } from "react";
// import {
//   Home as HomeIcon,
//   Users,
//   Video,
//   Euro,
//   Megaphone,
//   Logs,
//   Bell,
//   Cog,
//   PersonStanding,
//   LogOut,
//   TicketPercent,
//   ClipboardMinus,
//   Film,
//   Swords,
//   GraduationCap,
//   Store,
//   Book,
//   Disc3,
//   NotepadText,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import "../styles/Sidebar.css";
// import logo from "../assets/logo.png"; // Make sure you place your logo in /assets/

// const Sidebar = () => {
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);

//   const toggleUserDropdown = () => {
//     setUserDropdownOpen(!userDropdownOpen);
//   };

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-top">
//         <div className="sidebar-logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <div className="sidebar-header">
//           <h2>Dance with me</h2>
//         </div>
//       </div>

//       <div className="sidebar-content">
//         <nav className="menu">
//           <div className="menu-section">
//             <p className="menu-section-title">MAIN</p>
//             <ul>
//               <li>
//                 <Link to="/home">
//                   <HomeIcon size={18} /> Dashboard
//                 </Link>
//               </li>
//               <li onClick={toggleUserDropdown} className="has-submenu">
//                 <div className="menu-item-with-arrow">
//                   <Users size={18} />
//                   <span> Users</span>
//                   <span className={`arrow ${userDropdownOpen ? "open" : ""}`}>
//                     {userDropdownOpen ? "▲" : "▼"}
//                   </span>
//                 </div>
//                 {userDropdownOpen && (
//                   <ul className="submenu">
//                     <li>
//                       <Link to="/users/Dancers">
//                         <PersonStanding size={18} />
//                         Dancers
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to="/users/Professors">
//                         <GraduationCap size={18} />
//                         Professors
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to="/users/DJs">
//                         <Disc3 size={18} />
//                         D.Js
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to="/users/Organizers">
//                         <NotepadText size={18} />
//                         Organizers
//                       </Link>
//                     </li>
//                   </ul>
//                 )}
//               </li>
//               <li>
//                 <Link to="/CommunityContent">
//                   <Film size={18} /> Content Moderation
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/VideoPrograms">
//                   <Book size={18} /> Program Management
//                 </Link>
//               </li>
//               <li>
//                 <Link to="CreateChallenge">
//                   <Swords size={18} /> Challenges
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/ClassModeration">
//                   <Video size={18} /> Class Listing Approval
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/EventsPage">
//                   <TicketPercent size={18} /> Events
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/MarketplacePage">
//                   <Store size={18} /> Marketplace
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/PayoutsPage">
//                   <Euro size={18} /> Earnings & Payouts
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/ReportManagement">
//                   <ClipboardMinus size={18} /> Operation & Support
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/AccessLogs">
//                   <Logs size={18} /> Access Logs
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/AdsManagement">
//                   <Megaphone size={18} /> Ads Management
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <div className="menu-section">
//             <p className="menu-section-title">SETTINGS</p>
//             <ul>
//               <li>
//                 <Link to="/NotificationPage">
//                   <Bell size={18} /> Notification
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/SettingsPage">
//                   <Cog size={18} /> Settings
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       </div>

//       <div className="logout">
//         <Link to="/">
//           <LogOut size={18} /> Logout
//         </Link>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import {
  Home as HomeIcon,
  Users,
  Video,
  Euro,
  Megaphone,
  Logs,
  Bell,
  Cog,
  PersonStanding,
  LogOut,
  TicketPercent,
  ClipboardMinus,
  Film,
  Swords,
  GraduationCap,
  Store,
  Book,
  Disc3,
  NotepadText,
  Wallet,
  Banknote,
  Gavel,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [earningDropdownOpen, setEarningDropdownOpen] = useState(false);
  const [operationDropdownOpen, setOperationDropdownOpen] = useState(false);

  const toggleOperationDropdown = () => {
    setOperationDropdownOpen(!operationDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const toggleEarningDropdown = () => {
    setEarningDropdownOpen(!earningDropdownOpen);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="sidebar-header">
          <h2>Dance with me</h2>
        </div>
      </div>

      <div className="sidebar-content">
        <nav className="menu">
          <div className="menu-section">
            <p className="menu-section-title">MAIN</p>
            <ul>
              <li>
                <Link to="/home">
                  <HomeIcon size={18} /> Dashboard
                </Link>
              </li>

              {/* Users Dropdown */}
              <li onClick={toggleUserDropdown} className="has-submenu">
                <div className="menu-item-with-arrow">
                  <Users size={18} />
                  <span> Users</span>
                  <span className={`arrow ${userDropdownOpen ? "open" : ""}`}>
                    {userDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {userDropdownOpen && (
                  <ul className="submenu">
                    <li>
                      <Link to="/users/Dancers">
                        <PersonStanding size={18} />
                        Dancers
                      </Link>
                    </li>
                    <li>
                      <Link to="/users/Professors">
                        <GraduationCap size={18} />
                        Professors
                      </Link>
                    </li>
                    <li>
                      <Link to="/users/DJs">
                        <Disc3 size={18} />
                        D.Js
                      </Link>
                    </li>
                    <li>
                      <Link to="/users/Organizers">
                        <NotepadText size={18} />
                        Organizers
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link to="/CommunityContent">
                  <Film size={18} /> Content Moderation
                </Link>
              </li>
              <li>
                <Link to="/VideoPrograms">
                  <Book size={18} /> Program Management
                </Link>
              </li>
              <li>
                <Link to="/CreateChallenge">
                  <Swords size={18} /> Challenges
                </Link>
              </li>
              <li>
                <Link to="/ClassModeration">
                  <Video size={18} /> Class Listing Approval
                </Link>
              </li>
              <li>
                <Link to="/EventsPage">
                  <TicketPercent size={18} /> Events
                </Link>
              </li>
              <li>
                <Link to="/MarketplacePage">
                  <Store size={18} /> Marketplace
                </Link>
              </li>

              {/* Earnings & Payouts Dropdown */}
              <li onClick={toggleEarningDropdown} className="has-submenu">
                <div className="menu-item-with-arrow">
                  <Euro size={18} />
                  <span> Earnings & Payouts</span>
                  <span
                    className={`arrow ${earningDropdownOpen ? "open" : ""}`}
                  >
                    {earningDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {earningDropdownOpen && (
                  <ul className="submenu">
                    <li>
                      <Link to="/payouts/earnings">
                        <Wallet size={18} />
                        Earnings
                      </Link>
                    </li>
                    <li>
                      <Link to="/payouts/payouts">
                        <Banknote size={18} />
                        Payouts
                      </Link>
                    </li>
                    <li>
                      <Link to="/payouts/disputes">
                        <Gavel size={18} />
                        Disputes
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li onClick={toggleOperationDropdown} className="has-submenu">
                <div className="menu-item-with-arrow">
                  <ClipboardMinus size={18} />
                  <span> Operation & Support</span>
                  <span
                    className={`arrow ${operationDropdownOpen ? "open" : ""}`}
                  >
                    {operationDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {operationDropdownOpen && (
                  <ul className="submenu">
                    <li>
                      <Link to="/support/class-disputes">
                        <GraduationCap size={18} />
                        Class Related Dispute
                      </Link>
                    </li>
                    <li>
                      <Link to="/support/ticket-raise">
                        <NotepadText size={18} />
                        Ticket Raise
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/AccessLogs">
                  <Logs size={18} /> Access Logs
                </Link>
              </li>
              <li>
                <Link to="/AdsManagement">
                  <Megaphone size={18} /> Ads Management
                </Link>
              </li>
            </ul>
          </div>

          <div className="menu-section">
            <p className="menu-section-title">SETTINGS</p>
            <ul>
              <li>
                <Link to="/NotificationPage">
                  <Bell size={18} /> Notification
                </Link>
              </li>
              <li>
                <Link to="/SettingsPage">
                  <Cog size={18} /> Settings
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="logout">
        <Link to="/">
          <LogOut size={18} /> Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
