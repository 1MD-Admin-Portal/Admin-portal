// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/logo.png";
// import {
//   Home,
//   Users,
//   Video,
//   Euro,
//   Send,
//   Megaphone,
//   FileText,
//   BadgeCheck,
//   Bell,
//   Cog,
//   User,
//   LogOut,
//   Ticket,
//   Clipboard,
//   Film,
//   Swords,
//   GraduationCap,
//   Store,
//   Book,
//   Disc,
//   FileEdit,
//   Wallet,
//   Banknote,
//   Gavel,
//   Play,
//   Building,
//   Search,
//   BarChart,
//   Download,
//   ChevronDown,
//   ChevronRight,
//   PersonStanding,
//   Bug,
//   Building2,
//   Menu,
//   X,
// } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";

// const Sidebar = () => {
//   const sidebarScrollRef = useRef(null);
//   const location = useLocation();
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const [activePanel, setActivePanel] = useState("main");
//   const [isPanelOpen, setIsPanelOpen] = useState(true);

//   const handleActivityClick = (id) => {
//     if (activePanel === id && isPanelOpen) {
//       // Same icon clicked — collapse panel
//       setIsPanelOpen(false);
//     } else {
//       // Different icon or panel closed — open with new panel
//       setActivePanel(id);
//       setIsPanelOpen(true);
//     }
//   };

//   // Dropdown states
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [earningDropdownOpen, setEarningDropdownOpen] = useState(false);
//   const [operationDropdownOpen, setOperationDropdownOpen] = useState(false);
//   const [applicantDropdownOpen, setApplicantDropdownOpen] = useState(false);
//   const [contentDropdownOpen, setContentDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate("/", { replace: true });
//   };

//   const isRouteActive = (href) => location.pathname === href;
//   const isSubmenuActive = (items) => items.some((item) => location.pathname === item.href);

//   const userSubmenuItems = [
//     { href: "/users/Dancers", icon: User, label: "Dancers" },
//     { href: "/users/Professors", icon: GraduationCap, label: "Instructors" },
//     { href: "/users/DJs", icon: Disc, label: "D.Js" },
//     { href: "/users/Organizers", icon: FileEdit, label: "Organizers" },
//   ];

//   const applicantSubmenuItems = [
//     { href: "/Applicants/Professors", icon: GraduationCap, label: "Instructors" },
//     { href: "/Applicants/DJs", icon: Disc, label: "D.Js" },
//     { href: "/Applicants/Organizers", icon: FileEdit, label: "Organizers" },
//   ];

//   const contentSubmenuItems = [
//     { href: "/FeedPage", icon: Film, label: "User Generated Content" },
//     { href: "/VideoPrograms", icon: Book, label: "Video Program Management" },
//     { href: "/playlists", icon: Play, label: "Playlists" },
//     { href: "/CreateChallenge", icon: Swords, label: "Challenges" },
//   ];

//   const earningSubmenuItems = [
//     { href: "/payouts/earnings", icon: Wallet, label: "Earnings" },
//     { href: "/payouts/payouts", icon: Banknote, label: "Payouts" },
//   ];

//   const operationSubmenuItems = [
//     { href: "/support/ticket-raise", icon: FileEdit, label: "Ticket Raise" },
//   ];

//   // Auto-open dropdown if a submenu item is active
//   useEffect(() => {
//     if (isSubmenuActive(userSubmenuItems)) setUserDropdownOpen(true);
//     if (isSubmenuActive(applicantSubmenuItems)) setApplicantDropdownOpen(true);
//     if (isSubmenuActive(contentSubmenuItems)) setContentDropdownOpen(true);
//     if (isSubmenuActive(earningSubmenuItems)) setEarningDropdownOpen(true);
//     if (isSubmenuActive(operationSubmenuItems)) setOperationDropdownOpen(true);
//   }, [location.pathname]);

//   // Adjust body margin when panel opens/closes
//   useEffect(() => {
//     document.body.style.marginLeft = isPanelOpen ? "280px" : "55px";
//     document.body.style.transition = "margin-left 0.2s ease";
//   }, [isPanelOpen]);

//   // Save sidebar scroll position
//   useEffect(() => {
//     const sidebar = sidebarScrollRef.current;
//     if (!sidebar) return;
//     const savedScroll = sessionStorage.getItem("sidebar-scroll");
//     if (savedScroll !== null) sidebar.scrollTop = Number(savedScroll);
//     const handleScroll = () => sessionStorage.setItem("sidebar-scroll", sidebar.scrollTop);
//     sidebar.addEventListener("scroll", handleScroll);
//     return () => sidebar.removeEventListener("scroll", handleScroll);
//   }, [location.pathname]);

//   const toggleContentDropdown = () => setContentDropdownOpen(!contentDropdownOpen);
//   const toggleOperationDropdown = () => setOperationDropdownOpen(!operationDropdownOpen);
//   const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
//   const toggleApplicantDropdown = () => setApplicantDropdownOpen(!applicantDropdownOpen);
//   const toggleEarningDropdown = () => setEarningDropdownOpen(!earningDropdownOpen);

//   const MenuItem = ({ href, icon: Icon, children }) => (
//     <li className={`vs-menu-item ${isRouteActive(href) ? "active" : ""}`}>
//       <Link to={href} className="vs-menu-link">
//         <Icon size={15} className="vs-menu-icon" />
//         <span>{children}</span>
//       </Link>
//     </li>
//   );

//   const DropdownMenuItem = ({ icon: Icon, children, isOpen, onToggle, submenuItems }) => (
//     <li className="vs-dropdown-item">
//       <div className="vs-dropdown-trigger" onClick={onToggle}>
//         <Icon size={15} className="vs-menu-icon" />
//         <span>{children}</span>
//         <span className="vs-chevron">
//           {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
//         </span>
//       </div>
//       <div className={`vs-submenu-container ${isOpen ? "open" : ""}`}>
//         <ul className="vs-submenu">
//           {submenuItems.map((item, index) => (
//             <li
//               key={index}
//               className={`vs-submenu-item ${isRouteActive(item.href) ? "active" : ""}`}
//             >
//               <Link to={item.href} className="vs-submenu-link">
//                 <item.icon size={13} />
//                 <span>{item.label}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </li>
//   );

//   // Activity bar sections
//   const activityItems = [
//     { id: "main", icon: Home, label: "Main" },
//     { id: "users", icon: Users, label: "Users" },
//     { id: "content", icon: Video, label: "Content" },
//     { id: "earnings", icon: Euro, label: "Earnings" },
//     { id: "operations", icon: Clipboard, label: "Operations" },
//     { id: "settings", icon: Cog, label: "Settings" },
//   ];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap');

//         /* ─── Reset & Base ─────────────────────────────── */
//         * { box-sizing: border-box; }

//         /* ══════════════════════════════════════════════
//            ACTIVITY BAR
//         ══════════════════════════════════════════════ */

//         /* Deep purple-to-black gradient base */
//         .vs-activity-bar {
//           position: fixed;
//           top: 0; left: 0;
//           width: 55px;
//           height: 100vh;
//           background: linear-gradient(
//             180deg,
//             rgba(8, 5, 20, 0.97) 0%,
//             rgba(18, 10, 40, 0.95) 50%,
//             rgba(8, 5, 20, 0.97) 100%
//           );
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           z-index: 1000;
//           border-right: 1px solid rgba(255,255,255,0.06);
//           overflow: hidden;
//         }

//         /* Slow-drifting spotlight sweep — stage lights feel */
//         .vs-activity-bar::before {
//           content: '';
//           position: absolute;
//           top: -60px; left: -30px;
//           width: 110px; height: 320px;
//           background: linear-gradient(
//             160deg,
//             rgba(180, 80, 255, 0.10) 0%,
//             rgba(244, 160, 30, 0.07) 50%,
//             transparent 100%
//           );
//           border-radius: 50%;
//           filter: blur(28px);
//           pointer-events: none;
//           animation: driftLight 8s ease-in-out infinite alternate;
//         }

//         .vs-activity-bar::after {
//           content: '';
//           position: absolute;
//           bottom: 40px; left: -20px;
//           width: 90px; height: 200px;
//           background: radial-gradient(
//             ellipse at center,
//             rgba(244, 208, 63, 0.10) 0%,
//             transparent 70%
//           );
//           filter: blur(20px);
//           pointer-events: none;
//           animation: driftLight 8s ease-in-out infinite alternate-reverse;
//         }

//         @keyframes driftLight {
//           0%   { transform: translateY(0px) scale(1); opacity: 0.7; }
//           100% { transform: translateY(30px) scale(1.1); opacity: 1; }
//         }

//         /* ── Logo area ── */
//         .vs-activity-logo {
//           width: 55px; height: 54px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-bottom: 1px solid rgba(255,255,255,0.07);
//           flex-shrink: 0;
//           position: relative;
//           z-index: 2;
//           background: rgba(244, 208, 63, 0.04);
//         }

//         .vs-activity-logo img {
//           width: 30px; height: 30px;
//           object-fit: contain;
//           border-radius: 8px;
//           filter: drop-shadow(0 0 8px rgba(244, 208, 63, 0.5))
//                   drop-shadow(0 0 16px rgba(244, 208, 63, 0.2));
//         }

//         /* ── Nav strip ── */
//         .vs-activity-nav {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           flex: 1;
//           padding: 8px 0;
//           gap: 2px;
//           width: 100%;
//           position: relative;
//           z-index: 2;
//         }

//         /* ── Buttons ── */
//         .vs-activity-btn {
//           position: relative;
//           width: 100%; height: 48px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: none;
//           border: none;
//           color: rgba(255,255,255,0.28);
//           cursor: pointer;
//           transition: color 0.2s ease, background 0.2s ease;
//           overflow: hidden;
//         }

//         /* Subtle shimmer on hover */
//         .vs-activity-btn::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(135deg, rgba(244,208,63,0) 40%, rgba(244,208,63,0.04) 100%);
//           opacity: 0;
//           transition: opacity 0.2s ease;
//           pointer-events: none;
//         }

//         .vs-activity-btn:hover {
//           color: rgba(255,255,255,0.82);
//         }
//         .vs-activity-btn:hover::after { opacity: 1; }

//         /* Active state — golden lit icon */
//         .vs-activity-btn.active {
//           color: #f4d03f;
//           background: linear-gradient(
//             90deg,
//             rgba(244, 208, 63, 0.10) 0%,
//             rgba(244, 208, 63, 0.03) 100%
//           );
//         }

//         /* Gold left indicator bar with glow */
//         .vs-activity-btn.active::before {
//           content: '';
//           position: absolute;
//           left: 0; top: 8px; bottom: 8px;
//           width: 3px;
//           background: linear-gradient(180deg, #ffe066, #f4a800);
//           border-radius: 0 3px 3px 0;
//           box-shadow:
//             0 0 6px rgba(244, 208, 63, 0.8),
//             0 0 14px rgba(244, 208, 63, 0.35);
//         }

//         /* Icon halo ring for active */
//         .vs-activity-btn.active .vs-icon-wrap {
//           background: rgba(244, 208, 63, 0.10);
//           border: 1px solid rgba(244, 208, 63, 0.22);
//           border-radius: 10px;
//           padding: 6px;
//           filter: drop-shadow(0 0 5px rgba(244,208,63,0.4));
//         }

//         .vs-icon-wrap {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 6px;
//           border-radius: 10px;
//           border: 1px solid transparent;
//           transition: background 0.2s ease, border-color 0.2s ease, filter 0.2s ease;
//         }

//         .vs-activity-btn:hover .vs-icon-wrap {
//           background: rgba(255,255,255,0.05);
//           border-color: rgba(255,255,255,0.08);
//         }

//         /* Tooltip */
//         .vs-activity-tooltip {
//           position: absolute;
//           left: 64px;
//           background: rgba(10, 7, 28, 0.95);
//           backdrop-filter: blur(12px);
//           color: rgba(255,255,255,0.9);
//           font-size: 11px;
//           font-family: 'DM Sans', system-ui, sans-serif;
//           font-weight: 500;
//           padding: 5px 11px;
//           border-radius: 6px;
//           white-space: nowrap;
//           pointer-events: none;
//           opacity: 0;
//           transform: translateX(-6px);
//           transition: opacity 0.18s ease, transform 0.18s ease;
//           z-index: 9999;
//           border: 1px solid rgba(244,208,63,0.15);
//           box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
//         }

//         .vs-activity-btn:hover .vs-activity-tooltip {
//           opacity: 1;
//           transform: translateX(0);
//         }

//         /* Bottom logout area */
//         .vs-activity-bottom {
//           padding: 8px 0 14px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 2px;
//           width: 100%;
//           position: relative;
//           z-index: 2;
//         }

//         .vs-activity-bottom::before {
//           content: '';
//           display: block;
//           width: 28px;
//           height: 1px;
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
//           margin: 0 auto 6px;
//         }

//         /* ══════════════════════════════════════════════
//            SIDEBAR PANEL
//         ══════════════════════════════════════════════ */

//         .vs-sidebar-panel {
//           position: fixed;
//           top: 0; left: 55px;
//           width: 228px;
//           height: 100vh;
//           background: linear-gradient(
//             160deg,
//             rgba(14, 10, 35, 0.93) 0%,
//             rgba(20, 14, 48, 0.90) 40%,
//             rgba(12, 8, 30, 0.93) 100%
//           );
//           backdrop-filter: blur(28px);
//           -webkit-backdrop-filter: blur(28px);
//           display: flex;
//           flex-direction: column;
//           z-index: 999;
//           border-right: 1px solid rgba(255,255,255,0.07);
//           overflow: hidden;
//           transition: width 0.24s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
//         }

//         /* Vertical shimmer line on right edge */
//         .vs-sidebar-panel::after {
//           content: '';
//           position: absolute;
//           top: 0; right: 0;
//           width: 1px; height: 100%;
//           background: linear-gradient(
//             180deg,
//             transparent 0%,
//             rgba(180, 80, 255, 0.25) 25%,
//             rgba(244, 208, 63, 0.18) 55%,
//             rgba(180, 80, 255, 0.12) 80%,
//             transparent 100%
//           );
//           pointer-events: none;
//         }

//         /* Ambient top-left bloom inside panel */
//         .vs-sidebar-panel::before {
//           content: '';
//           position: absolute;
//           top: -40px; left: -20px;
//           width: 200px; height: 200px;
//           background: radial-gradient(
//             ellipse at 30% 30%,
//             rgba(160, 60, 255, 0.09) 0%,
//             transparent 65%
//           );
//           filter: blur(24px);
//           pointer-events: none;
//           animation: bloomPulse 6s ease-in-out infinite alternate;
//         }

//         @keyframes bloomPulse {
//           0%   { opacity: 0.6; transform: scale(1); }
//           100% { opacity: 1;   transform: scale(1.08); }
//         }

//         .vs-sidebar-panel.collapsed {
//           width: 0;
//           opacity: 0;
//           border-right: none;
//           pointer-events: none;
//         }

//         /* ── Panel Header ── */
//         .vs-panel-header {
//           height: 54px;
//           display: flex;
//           align-items: center;
//           padding: 0 18px;
//           border-bottom: 1px solid rgba(255,255,255,0.07);
//           flex-shrink: 0;
//           background: rgba(6, 4, 18, 0.6);
//           position: relative;
//           z-index: 1;
//         }

//         /* Gold sweep underline */
//         .vs-panel-header::after {
//           content: '';
//           position: absolute;
//           bottom: -1px; left: 0; right: 0;
//           height: 1px;
//           background: linear-gradient(
//             90deg,
//             rgba(244,208,63,0.5) 0%,
//             rgba(180,80,255,0.2) 50%,
//             transparent 100%
//           );
//         }

//         .vs-panel-title {
//           font-size: 10px;
//           font-weight: 600;
//           color: rgba(255,255,255,0.9);
//           text-transform: uppercase;
//           letter-spacing: 2px;
//           margin: 0;
//           font-family: 'Space Grotesk', system-ui, sans-serif;
//           white-space: nowrap;
//           background: linear-gradient(90deg, #ffffff 0%, rgba(244,208,63,0.8) 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         /* ── Scroll area ── */
//         .vs-panel-content {
//           flex: 1;
//           overflow-y: auto;
//           padding: 12px 0 6px;
//           scrollbar-width: thin;
//           scrollbar-color: rgba(244,208,63,0.15) transparent;
//           position: relative;
//           z-index: 1;
//         }

//         .vs-panel-content::-webkit-scrollbar { width: 3px; }
//         .vs-panel-content::-webkit-scrollbar-track { background: transparent; }
//         .vs-panel-content::-webkit-scrollbar-thumb {
//           background: rgba(244,208,63,0.18);
//           border-radius: 2px;
//         }
//         .vs-panel-content::-webkit-scrollbar-thumb:hover {
//           background: rgba(244,208,63,0.4);
//         }

//         /* ── Section labels ── */
//         .vs-section { margin-bottom: 6px; }

//         .vs-section-label {
//           font-size: 9px;
//           font-weight: 700;
//           color: rgba(244,208,63,0.35);
//           text-transform: uppercase;
//           letter-spacing: 1.8px;
//           padding: 12px 18px 5px;
//           margin: 0;
//           font-family: 'Space Grotesk', system-ui, sans-serif;
//           white-space: nowrap;
//         }

//         .vs-menu-list {
//           list-style: none;
//           margin: 0; padding: 0;
//         }

//         /* ── Menu items ── */
//         .vs-menu-item,
//         .vs-dropdown-item { margin: 0; }

//         .vs-menu-link,
//         .vs-dropdown-trigger {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 8px 18px;
//           text-decoration: none;
//           color: rgba(255,255,255,0.52);
//           font-size: 13px;
//           font-weight: 400;
//           font-family: 'DM Sans', system-ui, sans-serif;
//           cursor: pointer;
//           border-left: 2px solid transparent;
//           transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
//           user-select: none;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           position: relative;
//         }

//         /* Hover: faint warm glass tint */
//         .vs-menu-link:hover,
//         .vs-dropdown-trigger:hover {
//           background: rgba(255,255,255,0.045);
//           color: rgba(255,255,255,0.88);
//           border-left-color: rgba(255,255,255,0.1);
//         }

//         /* Active: gold glass row */
//         .vs-menu-item.active .vs-menu-link {
//           background: linear-gradient(
//             90deg,
//             rgba(244,208,63,0.10) 0%,
//             rgba(244,208,63,0.02) 100%
//           );
//           color: #f4d03f;
//           border-left: 2px solid #f4d03f;
//           font-weight: 500;
//         }

//         /* Right-end glow on active */
//         .vs-menu-item.active .vs-menu-link::after {
//           content: '';
//           position: absolute;
//           right: 0; top: 0; bottom: 0;
//           width: 40px;
//           background: linear-gradient(270deg, rgba(244,208,63,0.06), transparent);
//           pointer-events: none;
//         }

//         /* Icons */
//         .vs-menu-icon {
//           color: rgba(255,255,255,0.28);
//           flex-shrink: 0;
//           transition: color 0.18s ease, filter 0.18s ease;
//         }

//         .vs-menu-link:hover .vs-menu-icon,
//         .vs-dropdown-trigger:hover .vs-menu-icon {
//           color: rgba(255,255,255,0.65);
//         }

//         .vs-menu-item.active .vs-menu-link .vs-menu-icon {
//           color: #f4d03f;
//           filter: drop-shadow(0 0 5px rgba(244,208,63,0.55));
//         }

//         /* ── Chevron ── */
//         .vs-chevron {
//           margin-left: auto;
//           color: rgba(255,255,255,0.18);
//           display: flex;
//           align-items: center;
//           flex-shrink: 0;
//           transition: color 0.18s ease, transform 0.18s ease;
//         }

//         .vs-dropdown-trigger:hover .vs-chevron {
//           color: rgba(255,255,255,0.42);
//         }

//         /* ── Submenu ── */
//         .vs-submenu-container {
//           overflow: hidden;
//           max-height: 0;
//           transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .vs-submenu-container.open { max-height: 400px; }

//         .vs-submenu {
//           list-style: none;
//           margin: 3px 0 3px 18px;
//           padding: 4px 0;
//           background: rgba(0,0,0,0.22);
//           border-left: 1px solid rgba(244,208,63,0.12);
//           border-radius: 0 0 6px 6px;
//         }

//         .vs-submenu-item { margin: 0; }

//         .vs-submenu-link {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 14px;
//           text-decoration: none;
//           color: rgba(255,255,255,0.42);
//           font-size: 12px;
//           font-family: 'DM Sans', system-ui, sans-serif;
//           border-left: 2px solid transparent;
//           transition: background 0.15s ease, color 0.15s ease;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .vs-submenu-link:hover {
//           background: rgba(255,255,255,0.04);
//           color: rgba(255,255,255,0.82);
//         }

//         .vs-submenu-item.active .vs-submenu-link {
//           background: rgba(244,208,63,0.07);
//           color: #f4d03f;
//           border-left-color: rgba(244,208,63,0.55);
//           font-weight: 500;
//         }

//         /* ── Logout ── */
//         .vs-logout-section {
//           padding: 12px 14px 16px;
//           flex-shrink: 0;
//           position: relative;
//           z-index: 1;
//         }

//         /* Divider with gradient above logout */
//         .vs-logout-section::before {
//           content: '';
//           display: block;
//           height: 1px;
//           margin-bottom: 12px;
//           background: linear-gradient(
//             90deg,
//             transparent,
//             rgba(244,208,63,0.18) 40%,
//             rgba(180,80,255,0.12) 70%,
//             transparent
//           );
//         }

//         .vs-logout-btn {
//           display: flex;
//           align-items: center;
//           gap: 9px;
//           padding: 8px 14px;
//           background: rgba(220, 60, 60, 0.07);
//           border: 1px solid rgba(220, 60, 60, 0.20);
//           border-radius: 8px;
//           color: rgba(255, 110, 110, 0.82);
//           font-size: 12.5px;
//           font-family: 'DM Sans', system-ui, sans-serif;
//           font-weight: 500;
//           cursor: pointer;
//           width: 100%;
//           text-align: left;
//           transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
//         }

//         .vs-logout-btn:hover {
//           background: rgba(220, 60, 60, 0.14);
//           border-color: rgba(255, 100, 100, 0.38);
//           color: #ff8888;
//           box-shadow: 0 0 12px rgba(220, 60, 60, 0.15);
//         }

//         /* ── Panel visibility ── */
//         .vs-panel-body {
//           display: none;
//           flex-direction: column;
//           flex: 1;
//           overflow: hidden;
//           min-height: 0;
//         }

//         .vs-panel-body.visible { display: flex; }
//       `}</style>

//       {/* ── Activity Bar ─────────────────────────────────── */}
//       <div className="vs-activity-bar">
//         <div className="vs-activity-logo">
//           <img src={logo} alt="Logo" />
//         </div>

//         <div className="vs-activity-nav">
//           {activityItems.map((item) => (
//             <button
//               key={item.id}
//               className={`vs-activity-btn ${activePanel === item.id && isPanelOpen ? "active" : ""}`}
//               onClick={() => handleActivityClick(item.id)}
//               aria-label={item.label}
//             >
//               <span className="vs-icon-wrap">
//                 <item.icon size={20} />
//               </span>
//               <span className="vs-activity-tooltip">{item.label}</span>
//             </button>
//           ))}
//         </div>

//         <div className="vs-activity-bottom">
//           <button
//             className="vs-activity-btn"
//             onClick={handleLogout}
//             aria-label="Logout"
//           >
//             <span className="vs-icon-wrap">
//               <LogOut size={19} />
//             </span>
//             <span className="vs-activity-tooltip">Logout</span>
//           </button>
//         </div>
//       </div>

//       {/* ── Sidebar Panel ─────────────────────────────────── */}
//       <div className={`vs-sidebar-panel ${!isPanelOpen ? "collapsed" : ""}`}>
//         <div className="vs-panel-header">
//           <p className="vs-panel-title">
//             {activePanel === "main" && "Dashboard"}
//             {activePanel === "users" && "Users"}
//             {activePanel === "content" && "Content"}
//             {activePanel === "earnings" && "Earnings"}
//             {activePanel === "operations" && "Operations"}
//             {activePanel === "settings" && "Settings"}
//           </p>
//         </div>

//         {/* ── MAIN PANEL ── */}
//         <div className={`vs-panel-body ${activePanel === "main" ? "visible" : ""}`}>
//           <div className="vs-panel-content" ref={sidebarScrollRef}>
//             <nav>
//               <div className="vs-section">
//                 <ul className="vs-menu-list">
//                   <MenuItem href="/home" icon={Home}>Dashboard</MenuItem>
//                   <MenuItem href="/ClassModeration" icon={Video}>Class Listing Approval</MenuItem>
//                   <MenuItem href="/EventsPage" icon={Ticket}>Events</MenuItem>
//                   <MenuItem href="/MarketplacePage" icon={Store}>Marketplace</MenuItem>
//                   <MenuItem href="/studios" icon={Building2}>Studios</MenuItem>
//                   <MenuItem href="/badges" icon={BadgeCheck}>Badges</MenuItem>
//                   <MenuItem href="/referrals" icon={Send}>Referrals</MenuItem>
//                   <MenuItem href="/djevents" icon={Megaphone}>Dj Events</MenuItem>
//                   <MenuItem href="/beta-testers/bugs" icon={Bug}>Beta Tester Bugs</MenuItem>
//                 </ul>
//               </div>
//             </nav>
//           </div>
//           <div className="vs-logout-section">
//             <button className="vs-logout-btn" onClick={handleLogout}>
//               <LogOut size={15} />
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* ── USERS PANEL ── */}
//         <div className={`vs-panel-body ${activePanel === "users" ? "visible" : ""}`}>
//           <div className="vs-panel-content">
//             <nav>
//               <div className="vs-section">
//                 <p className="vs-section-label">Users</p>
//                 <ul className="vs-menu-list">
//                   <DropdownMenuItem
//                     icon={Users}
//                     isOpen={userDropdownOpen}
//                     onToggle={toggleUserDropdown}
//                     submenuItems={userSubmenuItems}
//                   >
//                     Users
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     icon={Users}
//                     isOpen={applicantDropdownOpen}
//                     onToggle={toggleApplicantDropdown}
//                     submenuItems={applicantSubmenuItems}
//                   >
//                     Applicants
//                   </DropdownMenuItem>
//                 </ul>
//               </div>
//             </nav>
//           </div>
//           <div className="vs-logout-section">
//             <button className="vs-logout-btn" onClick={handleLogout}>
//               <LogOut size={15} />
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* ── CONTENT PANEL ── */}
//         <div className={`vs-panel-body ${activePanel === "content" ? "visible" : ""}`}>
//           <div className="vs-panel-content">
//             <nav>
//               <div className="vs-section">
//                 <p className="vs-section-label">Content Moderation</p>
//                 <ul className="vs-menu-list">
//                   <DropdownMenuItem
//                     icon={Video}
//                     isOpen={contentDropdownOpen}
//                     onToggle={toggleContentDropdown}
//                     submenuItems={contentSubmenuItems}
//                   >
//                     Content Moderation
//                   </DropdownMenuItem>
//                   <MenuItem href="/ClassModeration" icon={Video}>Class Listing Approval</MenuItem>
//                 </ul>
//               </div>
//             </nav>
//           </div>
//           <div className="vs-logout-section">
//             <button className="vs-logout-btn" onClick={handleLogout}>
//               <LogOut size={15} />
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* ── EARNINGS PANEL ── */}
//         <div className={`vs-panel-body ${activePanel === "earnings" ? "visible" : ""}`}>
//           <div className="vs-panel-content">
//             <nav>
//               <div className="vs-section">
//                 <p className="vs-section-label">Earnings & Payouts</p>
//                 <ul className="vs-menu-list">
//                   <DropdownMenuItem
//                     icon={Euro}
//                     isOpen={earningDropdownOpen}
//                     onToggle={toggleEarningDropdown}
//                     submenuItems={earningSubmenuItems}
//                   >
//                     Earnings & Payouts
//                   </DropdownMenuItem>
//                 </ul>
//               </div>
//             </nav>
//           </div>
//           <div className="vs-logout-section">
//             <button className="vs-logout-btn" onClick={handleLogout}>
//               <LogOut size={15} />
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* ── OPERATIONS PANEL ── */}
//         <div className={`vs-panel-body ${activePanel === "operations" ? "visible" : ""}`}>
//           <div className="vs-panel-content">
//             <nav>
//               <div className="vs-section">
//                 <p className="vs-section-label">Operation & Support</p>
//                 <ul className="vs-menu-list">
//                   <DropdownMenuItem
//                     icon={Clipboard}
//                     isOpen={operationDropdownOpen}
//                     onToggle={toggleOperationDropdown}
//                     submenuItems={operationSubmenuItems}
//                   >
//                     Operation & Support
//                   </DropdownMenuItem>
//                 </ul>
//               </div>
//             </nav>
//           </div>
//           <div className="vs-logout-section">
//             <button className="vs-logout-btn" onClick={handleLogout}>
//               <LogOut size={15} />
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* ── SETTINGS PANEL ── */}
//         <div className={`vs-panel-body ${activePanel === "settings" ? "visible" : ""}`}>
//           <div className="vs-panel-content">
//             <nav>
//               <div className="vs-section">
//                 <p className="vs-section-label">Settings</p>
//                 <ul className="vs-menu-list">
//                   <MenuItem href="/NotificationPage" icon={Bell}>Notifications</MenuItem>
//                   <MenuItem href="/SettingsPage" icon={Cog}>Settings</MenuItem>
//                 </ul>
//               </div>
//             </nav>
//           </div>
//           <div className="vs-logout-section">
//             <button className="vs-logout-btn" onClick={handleLogout}>
//               <LogOut size={15} />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  Home,
  Users,
  Video,
  Euro,
  Send,
  Megaphone,
  FileText,
  BadgeCheck,
  Bell,
  Cog,
  User,
  LogOut,
  Ticket,
  Clipboard,
  Film,
  Swords,
  GraduationCap,
  Store,
  Book,
  Disc,
  FileEdit,
  Wallet,
  Banknote,
  Gavel,
  Play,
  Building,
  Search,
  BarChart,
  Download,
  ChevronDown,
  ChevronRight,
  PersonStanding,
  Bug,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const sidebarScrollRef = useRef(null);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activePanel, setActivePanel] = useState("main");
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleActivityClick = (id) => {
    if (activePanel === id && isPanelOpen) {
      // Same icon clicked — collapse panel
      setIsPanelOpen(false);
    } else {
      // Different icon or panel closed — open with new panel
      setActivePanel(id);
      setIsPanelOpen(true);
    }
  };

  // Dropdown states
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [earningDropdownOpen, setEarningDropdownOpen] = useState(false);
  const [operationDropdownOpen, setOperationDropdownOpen] = useState(false);
  const [applicantDropdownOpen, setApplicantDropdownOpen] = useState(false);
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isRouteActive = (href) => location.pathname === href;
  const isSubmenuActive = (items) => items.some((item) => location.pathname === item.href);

  const userSubmenuItems = [
    { href: "/users/Dancers", icon: User, label: "Dancers" },
    { href: "/users/Professors", icon: GraduationCap, label: "Instructors" },
    { href: "/users/DJs", icon: Disc, label: "D.Js" },
    { href: "/users/Organizers", icon: FileEdit, label: "Organizers" },
  ];

  const applicantSubmenuItems = [
    { href: "/Applicants/Professors", icon: GraduationCap, label: "Instructors" },
    { href: "/Applicants/DJs", icon: Disc, label: "D.Js" },
    { href: "/Applicants/Organizers", icon: FileEdit, label: "Organizers" },
  ];

  const contentSubmenuItems = [
    { href: "/FeedPage", icon: Film, label: "User Generated Content" },
    { href: "/VideoPrograms", icon: Book, label: "Video Program Management" },
    { href: "/playlists", icon: Play, label: "Playlists" },
    { href: "/CreateChallenge", icon: Swords, label: "Challenges" },
  ];

  const earningSubmenuItems = [
    { href: "/payouts/earnings", icon: Wallet, label: "Earnings" },
    { href: "/payouts/payouts", icon: Banknote, label: "Payouts" },
  ];

  const operationSubmenuItems = [
    // { href: "/support/class-disputes", icon: FileEdit, label: "Class Disputes" },
    { href: "/support/ticket-raise", icon: FileEdit, label: "Ticket Raise" },
  ];

  // Auto-open dropdown if a submenu item is active
  useEffect(() => {
    if (isSubmenuActive(userSubmenuItems)) setUserDropdownOpen(true);
    if (isSubmenuActive(applicantSubmenuItems)) setApplicantDropdownOpen(true);
    if (isSubmenuActive(contentSubmenuItems)) setContentDropdownOpen(true);
    if (isSubmenuActive(earningSubmenuItems)) setEarningDropdownOpen(true);
    if (isSubmenuActive(operationSubmenuItems)) setOperationDropdownOpen(true);
  }, [location.pathname]);

  // Adjust body margin when panel opens/closes
  useEffect(() => {
    document.body.style.marginLeft = isPanelOpen ? "280px" : "55px";
    document.body.style.transition = "margin-left 0.2s ease";
  }, [isPanelOpen]);

  // Save sidebar scroll position
  useEffect(() => {
    const sidebar = sidebarScrollRef.current;
    if (!sidebar) return;
    const savedScroll = sessionStorage.getItem("sidebar-scroll");
    if (savedScroll !== null) sidebar.scrollTop = Number(savedScroll);
    const handleScroll = () => sessionStorage.setItem("sidebar-scroll", sidebar.scrollTop);
    sidebar.addEventListener("scroll", handleScroll);
    return () => sidebar.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const sprinklesRef = useRef(null);

  useEffect(() => {
    const container = sprinklesRef.current;
    if (!container) return;
    container.innerHTML = "";

    const count = 38;
    const colors = [
      "rgba(244,208,63,VAR)",
      "rgba(255,220,80,VAR)",
      "rgba(255,200,40,VAR)",
      "rgba(230,170,30,VAR)",
      "rgba(255,240,140,VAR)",
    ];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "vs-sprinkle";

      const size = Math.random() * 3.5 + 1;           // 1–4.5px
      const left = Math.random() * 96 + 2;            // 2–98%
      const bottom = Math.random() * 60;              // 0–60% from bottom
      const duration = Math.random() * 9 + 7;        // 7–16s
      const delay = Math.random() * 12;               // 0–12s stagger
      const colorTemplate = colors[Math.floor(Math.random() * colors.length)];
      const opacity = (Math.random() * 0.5 + 0.3).toFixed(2);
      const color = colorTemplate.replace("VAR", opacity);

      // Mix: most are floating circles, some are tiny diamond shapes
      const isDiamond = Math.random() < 0.28;
      const isStar    = Math.random() < 0.18;

      el.style.cssText = `
        width: ${size}px;
        height: ${isDiamond ? size : size}px;
        left: ${left}%;
        bottom: ${bottom}%;
        background: ${color};
        animation: sprinkleFloat ${duration}s ${delay}s linear infinite;
        box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px rgba(244,208,63,0.15);
        ${isDiamond ? "border-radius: 1px; transform: rotate(45deg);" : "border-radius: 50%;"}
      `;

      // Overlay a twinkle on ~40% of dots
      if (Math.random() < 0.4) {
        el.style.animation = `
          sprinkleFloat ${duration}s ${delay}s linear infinite,
          sprinkleTwinkle ${(Math.random() * 2 + 1.5).toFixed(1)}s ${(Math.random() * 2).toFixed(1)}s ease-in-out infinite
        `;
      }

      container.appendChild(el);
    }
  }, []);
  const toggleContentDropdown = () => setContentDropdownOpen(!contentDropdownOpen);
  const toggleOperationDropdown = () => setOperationDropdownOpen(!operationDropdownOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const toggleApplicantDropdown = () => setApplicantDropdownOpen(!applicantDropdownOpen);
  const toggleEarningDropdown = () => setEarningDropdownOpen(!earningDropdownOpen);

  const MenuItem = ({ href, icon: Icon, children }) => (
    <li className={`vs-menu-item ${isRouteActive(href) ? "active" : ""}`}>
      <Link to={href} className="vs-menu-link">
        <Icon size={15} className="vs-menu-icon" />
        <span>{children}</span>
      </Link>
    </li>
  );

  const DropdownMenuItem = ({ icon: Icon, children, isOpen, onToggle, submenuItems }) => (
    <li className="vs-dropdown-item">
      <div className="vs-dropdown-trigger" onClick={onToggle}>
        <Icon size={15} className="vs-menu-icon" />
        <span>{children}</span>
        <span className="vs-chevron">
          {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </span>
      </div>
      <div className={`vs-submenu-container ${isOpen ? "open" : ""}`}>
        <ul className="vs-submenu">
          {submenuItems.map((item, index) => (
            <li
              key={index}
              className={`vs-submenu-item ${isRouteActive(item.href) ? "active" : ""}`}
            >
              <Link to={item.href} className="vs-submenu-link">
                <item.icon size={13} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );

  // Activity bar sections
  const activityItems = [
    { id: "main", icon: Home, label: "Main" },
    { id: "users", icon: Users, label: "Users" },
    { id: "content", icon: Video, label: "Content" },
    { id: "earnings", icon: Euro, label: "Earnings" },
    { id: "operations", icon: Clipboard, label: "Operations" },
    { id: "settings", icon: Cog, label: "Settings" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap');

        /* ─── Reset & Base ─────────────────────────────── */
        * { box-sizing: border-box; }

        /* ══════════════════════════════════════════════
           ACTIVITY BAR
        ══════════════════════════════════════════════ */

        /* Deep purple-to-black gradient base */
        .vs-activity-bar {
          position: fixed;
          top: 0; left: 0;
          width: 55px;
          height: 100vh;
          background: linear-gradient(
            180deg,
            rgba(8, 5, 20, 0.97) 0%,
            rgba(18, 10, 40, 0.95) 50%,
            rgba(8, 5, 20, 0.97) 100%
          );
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1000;
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }

        /* Slow-drifting spotlight sweep — stage lights feel */
        .vs-activity-bar::before {
          content: '';
          position: absolute;
          top: -60px; left: -30px;
          width: 110px; height: 320px;
          background: linear-gradient(
            160deg,
            rgba(180, 80, 255, 0.10) 0%,
            rgba(244, 160, 30, 0.07) 50%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(28px);
          pointer-events: none;
          animation: driftLight 8s ease-in-out infinite alternate;
        }

        .vs-activity-bar::after {
          content: '';
          position: absolute;
          bottom: 40px; left: -20px;
          width: 90px; height: 200px;
          background: radial-gradient(
            ellipse at center,
            rgba(244, 208, 63, 0.10) 0%,
            transparent 70%
          );
          filter: blur(20px);
          pointer-events: none;
          animation: driftLight 8s ease-in-out infinite alternate-reverse;
        }

        @keyframes driftLight {
          0%   { transform: translateY(0px) scale(1); opacity: 0.7; }
          100% { transform: translateY(30px) scale(1.1); opacity: 1; }
        }

        /* ── Logo area ── */
        .vs-activity-logo {
          width: 55px; height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
          position: relative;
          z-index: 2;
          background: rgba(244, 208, 63, 0.04);
        }

        .vs-activity-logo img {
          width: 30px; height: 30px;
          object-fit: contain;
          border-radius: 8px;
          filter: drop-shadow(0 0 8px rgba(244, 208, 63, 0.5))
                  drop-shadow(0 0 16px rgba(244, 208, 63, 0.2));
        }

        /* ── Nav strip ── */
        .vs-activity-nav {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 8px 0;
          gap: 2px;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        /* ── Buttons ── */
        .vs-activity-btn {
          position: relative;
          width: 100%; height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: rgba(255,255,255,0.28);
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease;
          overflow: hidden;
        }

        /* Subtle shimmer on hover */
        .vs-activity-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(244,208,63,0) 40%, rgba(244,208,63,0.04) 100%);
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
        }

        .vs-activity-btn:hover {
          color: rgba(255,255,255,0.82);
        }
        .vs-activity-btn:hover::after { opacity: 1; }

        /* Active state — golden lit icon */
        .vs-activity-btn.active {
          color: #f4d03f;
          background: linear-gradient(
            90deg,
            rgba(244, 208, 63, 0.10) 0%,
            rgba(244, 208, 63, 0.03) 100%
          );
        }

        /* Gold left indicator bar with glow */
        .vs-activity-btn.active::before {
          content: '';
          position: absolute;
          left: 0; top: 8px; bottom: 8px;
          width: 3px;
          background: linear-gradient(180deg, #ffe066, #f4a800);
          border-radius: 0 3px 3px 0;
          box-shadow:
            0 0 6px rgba(244, 208, 63, 0.8),
            0 0 14px rgba(244, 208, 63, 0.35);
        }

        /* Icon halo ring for active */
        .vs-activity-btn.active .vs-icon-wrap {
          background: rgba(244, 208, 63, 0.10);
          border: 1px solid rgba(244, 208, 63, 0.22);
          border-radius: 10px;
          padding: 6px;
          filter: drop-shadow(0 0 5px rgba(244,208,63,0.4));
        }

        .vs-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 10px;
          border: 1px solid transparent;
          transition: background 0.2s ease, border-color 0.2s ease, filter 0.2s ease;
        }

        .vs-activity-btn:hover .vs-icon-wrap {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }

        /* Tooltip */
        .vs-activity-tooltip {
          position: absolute;
          left: 64px;
          background: rgba(10, 7, 28, 0.95);
          backdrop-filter: blur(12px);
          color: rgba(255,255,255,0.9);
          font-size: 11px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 500;
          padding: 5px 11px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.18s ease, transform 0.18s ease;
          z-index: 9999;
          border: 1px solid rgba(244,208,63,0.15);
          box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
        }

        .vs-activity-btn:hover .vs-activity-tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        /* Bottom logout area */
        .vs-activity-bottom {
          padding: 8px 0 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .vs-activity-bottom::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          margin: 0 auto 6px;
        }

        /* ══════════════════════════════════════════════
           SIDEBAR PANEL
        ══════════════════════════════════════════════ */

        .vs-sidebar-panel {
          position: fixed;
          top: 0; left: 55px;
          width: 228px;
          height: 100vh;
          background: linear-gradient(
            160deg,
            rgba(14, 10, 35, 0.93) 0%,
            rgba(20, 14, 48, 0.90) 40%,
            rgba(12, 8, 30, 0.93) 100%
          );
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          display: flex;
          flex-direction: column;
          z-index: 999;
          border-right: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          transition: width 0.24s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
        }

        /* Vertical shimmer line on right edge */
        .vs-sidebar-panel::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 1px; height: 100%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(180, 80, 255, 0.25) 25%,
            rgba(244, 208, 63, 0.18) 55%,
            rgba(180, 80, 255, 0.12) 80%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* Ambient top-left bloom inside panel */
        .vs-sidebar-panel::before {
          content: '';
          position: absolute;
          top: -40px; left: -20px;
          width: 200px; height: 200px;
          background: radial-gradient(
            ellipse at 30% 30%,
            rgba(160, 60, 255, 0.09) 0%,
            transparent 65%
          );
          filter: blur(24px);
          pointer-events: none;
          animation: bloomPulse 6s ease-in-out infinite alternate;
        }

        @keyframes bloomPulse {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 1;   transform: scale(1.08); }
        }

        .vs-sidebar-panel.collapsed {
          width: 0;
          opacity: 0;
          border-right: none;
          pointer-events: none;
        }

        /* ── Panel Header ── */
        .vs-panel-header {
          height: 54px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
          background: rgba(6, 4, 18, 0.6);
          position: relative;
          z-index: 1;
        }

        /* Gold sweep underline */
        .vs-panel-header::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(244,208,63,0.5) 0%,
            rgba(180,80,255,0.2) 50%,
            transparent 100%
          );
        }

        .vs-panel-title {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          white-space: nowrap;
          background: linear-gradient(90deg, #ffffff 0%, rgba(244,208,63,0.8) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Scroll area ── */
        .vs-panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 12px 0 6px;
          scrollbar-width: thin;
          scrollbar-color: rgba(244,208,63,0.15) transparent;
          position: relative;
          z-index: 1;
        }

        .vs-panel-content::-webkit-scrollbar { width: 3px; }
        .vs-panel-content::-webkit-scrollbar-track { background: transparent; }
        .vs-panel-content::-webkit-scrollbar-thumb {
          background: rgba(244,208,63,0.18);
          border-radius: 2px;
        }
        .vs-panel-content::-webkit-scrollbar-thumb:hover {
          background: rgba(244,208,63,0.4);
        }

        /* ── Section labels ── */
        .vs-section { margin-bottom: 6px; }

        .vs-section-label {
          font-size: 9px;
          font-weight: 700;
          color: rgba(244,208,63,0.35);
          text-transform: uppercase;
          letter-spacing: 1.8px;
          padding: 12px 18px 5px;
          margin: 0;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          white-space: nowrap;
        }

        .vs-menu-list {
          list-style: none;
          margin: 0; padding: 0;
        }

        /* ── Menu items ── */
        .vs-menu-item,
        .vs-dropdown-item { margin: 0; }

        .vs-menu-link,
        .vs-dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 18px;
          text-decoration: none;
          color: rgba(255,255,255,0.52);
          font-size: 13px;
          font-weight: 400;
          font-family: 'DM Sans', system-ui, sans-serif;
          cursor: pointer;
          border-left: 2px solid transparent;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
          user-select: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
        }

        /* Hover: faint warm glass tint */
        .vs-menu-link:hover,
        .vs-dropdown-trigger:hover {
          background: rgba(255,255,255,0.045);
          color: rgba(255,255,255,0.88);
          border-left-color: rgba(255,255,255,0.1);
        }

        /* Active: gold glass row */
        .vs-menu-item.active .vs-menu-link {
          background: linear-gradient(
            90deg,
            rgba(244,208,63,0.10) 0%,
            rgba(244,208,63,0.02) 100%
          );
          color: #f4d03f;
          border-left: 2px solid #f4d03f;
          font-weight: 500;
        }

        /* Right-end glow on active */
        .vs-menu-item.active .vs-menu-link::after {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 40px;
          background: linear-gradient(270deg, rgba(244,208,63,0.06), transparent);
          pointer-events: none;
        }

        /* Icons */
        .vs-menu-icon {
          color: rgba(255,255,255,0.28);
          flex-shrink: 0;
          transition: color 0.18s ease, filter 0.18s ease;
        }

        .vs-menu-link:hover .vs-menu-icon,
        .vs-dropdown-trigger:hover .vs-menu-icon {
          color: rgba(255,255,255,0.65);
        }

        .vs-menu-item.active .vs-menu-link .vs-menu-icon {
          color: #f4d03f;
          filter: drop-shadow(0 0 5px rgba(244,208,63,0.55));
        }

        /* ── Chevron ── */
        .vs-chevron {
          margin-left: auto;
          color: rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: color 0.18s ease, transform 0.18s ease;
        }

        .vs-dropdown-trigger:hover .vs-chevron {
          color: rgba(255,255,255,0.42);
        }

        /* ── Submenu ── */
        .vs-submenu-container {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .vs-submenu-container.open { max-height: 400px; }

        .vs-submenu {
          list-style: none;
          margin: 3px 0 3px 18px;
          padding: 4px 0;
          background: rgba(0,0,0,0.22);
          border-left: 1px solid rgba(244,208,63,0.12);
          border-radius: 0 0 6px 6px;
        }

        .vs-submenu-item { margin: 0; }

        .vs-submenu-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          text-decoration: none;
          color: rgba(255,255,255,0.42);
          font-size: 12px;
          font-family: 'DM Sans', system-ui, sans-serif;
          border-left: 2px solid transparent;
          transition: background 0.15s ease, color 0.15s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vs-submenu-link:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.82);
        }

        .vs-submenu-item.active .vs-submenu-link {
          background: rgba(244,208,63,0.07);
          color: #f4d03f;
          border-left-color: rgba(244,208,63,0.55);
          font-weight: 500;
        }

        /* ── Logout ── */
        .vs-logout-section {
          padding: 12px 14px 16px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        /* Divider with gradient above logout */
        .vs-logout-section::before {
          content: '';
          display: block;
          height: 1px;
          margin-bottom: 12px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(244,208,63,0.18) 40%,
            rgba(180,80,255,0.12) 70%,
            transparent
          );
        }

        .vs-logout-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 14px;
          background: rgba(220, 60, 60, 0.07);
          border: 1px solid rgba(220, 60, 60, 0.20);
          border-radius: 8px;
          color: rgba(255, 110, 110, 0.82);
          font-size: 12.5px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
        }

        .vs-logout-btn:hover {
          background: rgba(220, 60, 60, 0.14);
          border-color: rgba(255, 100, 100, 0.38);
          color: #ff8888;
          box-shadow: 0 0 12px rgba(220, 60, 60, 0.15);
        }

        /* ── Gold Sprinkles ── */
        .vs-sprinkles {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 55%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .vs-sprinkle {
          position: absolute;
          border-radius: 50%;
          animation: sprinkleFloat linear infinite;
          opacity: 0;
        }

        @keyframes sprinkleFloat {
          0%   { transform: translateY(0) rotate(0deg) scale(1);   opacity: 0; }
          8%   { opacity: 1; }
          85%  { opacity: 0.6; }
          100% { transform: translateY(-280px) rotate(360deg) scale(0.3); opacity: 0; }
        }

        @keyframes sprinkleTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.85; transform: scale(1.6); }
        }

        /* ── Panel visibility ── */
        .vs-panel-body {
          display: none;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
          min-height: 0;
        }

        .vs-panel-body.visible { display: flex; }
      `}</style>

      {/* ── Activity Bar ─────────────────────────────────── */}
      <div className="vs-activity-bar">
        <div className="vs-activity-logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="vs-activity-nav">
          {activityItems.map((item) => (
            <button
              key={item.id}
              className={`vs-activity-btn ${activePanel === item.id && isPanelOpen ? "active" : ""}`}
              onClick={() => handleActivityClick(item.id)}
              aria-label={item.label}
            >
              <span className="vs-icon-wrap">
                <item.icon size={20} />
              </span>
              <span className="vs-activity-tooltip">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="vs-activity-bottom">
          <button
            className="vs-activity-btn"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <span className="vs-icon-wrap">
              <LogOut size={19} />
            </span>
            <span className="vs-activity-tooltip">Logout</span>
          </button>
        </div>
      </div>

      {/* ── Sidebar Panel ─────────────────────────────────── */}
      <div className={`vs-sidebar-panel ${!isPanelOpen ? "collapsed" : ""}`}>
        <div className="vs-panel-header">
          <p className="vs-panel-title">
            {activePanel === "main" && "ONE TRILLION DANCERS"}
            {activePanel === "users" && "ONE TRILLION DANCERS"}
            {activePanel === "content" && "ONE TRILLION DANCERS"}
            {activePanel === "earnings" && "ONE TRILLION DANCERS"}
            {activePanel === "operations" && "ONE TRILLION DANCERS"}
            {activePanel === "settings" && "ONE TRILLION DANCERS"}
          </p>
        </div>

        {/* ── MAIN PANEL ── */}
        <div className={`vs-panel-body ${activePanel === "main" ? "visible" : ""}`}>
          <div className="vs-panel-content" ref={sidebarScrollRef}>
            <nav>
              <div className="vs-section">
                <ul className="vs-menu-list">
                  <MenuItem href="/home" icon={Home}>Dashboard</MenuItem>
                  <MenuItem href="/ClassModeration" icon={Video}>Class Listing Approval</MenuItem>
                  <MenuItem href="/EventsPage" icon={Ticket}>Events</MenuItem>
                  <MenuItem href="/MarketplacePage" icon={Store}>Marketplace</MenuItem>
                  <MenuItem href="/studios" icon={Building2}>Studios</MenuItem>
                  <MenuItem href="/badges" icon={BadgeCheck}>Badges</MenuItem>
                  <MenuItem href="/referrals" icon={Send}>Referrals</MenuItem>
                  <MenuItem href="/djevents" icon={Megaphone}>Dj Events</MenuItem>
                  <MenuItem href="/beta-testers/bugs" icon={Bug}>Beta Tester Bugs</MenuItem>
                </ul>
              </div>
            </nav>
          </div>
          <div className="vs-logout-section">
            <button className="vs-logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>

        {/* ── USERS PANEL ── */}
        <div className={`vs-panel-body ${activePanel === "users" ? "visible" : ""}`}>
          <div className="vs-panel-content">
            <nav>
              <div className="vs-section">
                <p className="vs-section-label">Users</p>
                <ul className="vs-menu-list">
                  <DropdownMenuItem
                    icon={Users}
                    isOpen={userDropdownOpen}
                    onToggle={toggleUserDropdown}
                    submenuItems={userSubmenuItems}
                  >
                    Users
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    icon={Users}
                    isOpen={applicantDropdownOpen}
                    onToggle={toggleApplicantDropdown}
                    submenuItems={applicantSubmenuItems}
                  >
                    Applicants
                  </DropdownMenuItem>
                </ul>
              </div>
            </nav>
          </div>
          <div className="vs-logout-section">
            <button className="vs-logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>

        {/* ── CONTENT PANEL ── */}
        <div className={`vs-panel-body ${activePanel === "content" ? "visible" : ""}`}>
          <div className="vs-panel-content">
            <nav>
              <div className="vs-section">
                <p className="vs-section-label">Content Moderation</p>
                <ul className="vs-menu-list">
                  <DropdownMenuItem
                    icon={Video}
                    isOpen={contentDropdownOpen}
                    onToggle={toggleContentDropdown}
                    submenuItems={contentSubmenuItems}
                  >
                    Content Moderation
                  </DropdownMenuItem>
                  <MenuItem href="/ClassModeration" icon={Video}>Class Listing Approval</MenuItem>
                </ul>
              </div>
            </nav>
          </div>
          <div className="vs-logout-section">
            <button className="vs-logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>

        {/* ── EARNINGS PANEL ── */}
        <div className={`vs-panel-body ${activePanel === "earnings" ? "visible" : ""}`}>
          <div className="vs-panel-content">
            <nav>
              <div className="vs-section">
                <p className="vs-section-label">Earnings & Payouts</p>
                <ul className="vs-menu-list">
                  <DropdownMenuItem
                    icon={Euro}
                    isOpen={earningDropdownOpen}
                    onToggle={toggleEarningDropdown}
                    submenuItems={earningSubmenuItems}
                  >
                    Earnings & Payouts
                  </DropdownMenuItem>
                </ul>
              </div>
            </nav>
          </div>
          <div className="vs-logout-section">
            <button className="vs-logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>

        {/* ── OPERATIONS PANEL ── */}
        <div className={`vs-panel-body ${activePanel === "operations" ? "visible" : ""}`}>
          <div className="vs-panel-content">
            <nav>
              <div className="vs-section">
                <p className="vs-section-label">Operation & Support</p>
                <ul className="vs-menu-list">
                  <DropdownMenuItem
                    icon={Clipboard}
                    isOpen={operationDropdownOpen}
                    onToggle={toggleOperationDropdown}
                    submenuItems={operationSubmenuItems}
                  >
                    Operation & Support
                  </DropdownMenuItem>
                </ul>
              </div>
            </nav>
          </div>
          <div className="vs-logout-section">
            <button className="vs-logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>

        {/* ── SETTINGS PANEL ── */}
        <div className={`vs-panel-body ${activePanel === "settings" ? "visible" : ""}`}>
          <div className="vs-panel-content">
            <nav>
              <div className="vs-section">
                <p className="vs-section-label">Settings</p>
                <ul className="vs-menu-list">
                  <MenuItem href="/NotificationPage" icon={Bell}>Notifications</MenuItem>
                  <MenuItem href="/SettingsPage" icon={Cog}>Settings</MenuItem>
                </ul>
              </div>
            </nav>
          </div>
          <div className="vs-logout-section">
            <button className="vs-logout-btn" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
        {/* ── Gold Sprinkles ── */}
        <div className="vs-sprinkles" ref={sprinklesRef} />
      </div>
    </>
  );
};

export default Sidebar;