import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";
import {
  Home, Users, Video, Euro, Send, Megaphone, BadgeCheck,
  Bell, Cog, User, LogOut, Ticket, Clipboard, Film, Swords,
  GraduationCap, Store, Book, Disc, FileEdit, Wallet, Banknote,
  Play, ChevronDown, ChevronRight, Bug, Building2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const sidebarScrollRef = useRef(null);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const sprinklesRef = useRef(null);

  const [activePanel, setActivePanel] = useState("main");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [earningDropdownOpen, setEarningDropdownOpen] = useState(false);
  const [operationDropdownOpen, setOperationDropdownOpen] = useState(false);
  const [applicantDropdownOpen, setApplicantDropdownOpen] = useState(false);
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);

  const handleActivityClick = (id) => {
    if (activePanel === id && isPanelOpen) setIsPanelOpen(false);
    else { setActivePanel(id); setIsPanelOpen(true); }
  };

  const handleLogout = () => { logout(); navigate("/", { replace: true }); };
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
    { href: "/VideoPrograms", icon: Book, label: "Video Programs" },
    { href: "/playlists", icon: Play, label: "Playlists" },
    { href: "/CreateChallenge", icon: Swords, label: "Challenges" },
  ];
  const earningSubmenuItems = [
    { href: "/payouts/earnings", icon: Wallet, label: "Earnings" },
    { href: "/payouts/payouts", icon: Banknote, label: "Payouts" },
  ];
  const operationSubmenuItems = [
    { href: "/support/ticket-raise", icon: FileEdit, label: "Ticket Raise" },
  ];

  useEffect(() => {
    if (isSubmenuActive(userSubmenuItems)) setUserDropdownOpen(true);
    if (isSubmenuActive(applicantSubmenuItems)) setApplicantDropdownOpen(true);
    if (isSubmenuActive(contentSubmenuItems)) setContentDropdownOpen(true);
    if (isSubmenuActive(earningSubmenuItems)) setEarningDropdownOpen(true);
    if (isSubmenuActive(operationSubmenuItems)) setOperationDropdownOpen(true);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.marginLeft = isPanelOpen ? "280px" : "56px";
    document.body.style.transition = "margin-left 0.22s cubic-bezier(0.4,0,0.2,1)";
  }, [isPanelOpen]);

  useEffect(() => {
    const sidebar = sidebarScrollRef.current;
    if (!sidebar) return;
    const saved = sessionStorage.getItem("sidebar-scroll");
    if (saved !== null) sidebar.scrollTop = Number(saved);
    const onScroll = () => sessionStorage.setItem("sidebar-scroll", sidebar.scrollTop);
    sidebar.addEventListener("scroll", onScroll);
    return () => sidebar.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    const container = sprinklesRef.current;
    if (!container) return;
    container.innerHTML = "";
    const count = 32;
    const colors = ["rgba(244,208,63,VAR)", "rgba(255,220,80,VAR)", "rgba(255,200,40,VAR)", "rgba(230,170,30,VAR)", "rgba(255,240,140,VAR)"];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "vs-sprinkle";
      const size = Math.random() * 3 + 1;
      const left = Math.random() * 96 + 2;
      const bottom = Math.random() * 55;
      const duration = Math.random() * 9 + 7;
      const delay = Math.random() * 12;
      const colorTemplate = colors[Math.floor(Math.random() * colors.length)];
      const opacity = (Math.random() * 0.45 + 0.25).toFixed(2);
      const color = colorTemplate.replace("VAR", opacity);
      const isDiamond = Math.random() < 0.28;
      el.style.cssText = `width:${size}px;height:${size}px;left:${left}%;bottom:${bottom}%;background:${color};animation:sprinkleFloat ${duration}s ${delay}s linear infinite;box-shadow:0 0 ${size * 2}px ${color};${isDiamond ? "border-radius:1px;transform:rotate(45deg);" : "border-radius:50%;"}`;
      if (Math.random() < 0.4) {
        el.style.animation = `sprinkleFloat ${duration}s ${delay}s linear infinite, sprinkleTwinkle ${(Math.random() * 2 + 1.5).toFixed(1)}s ${(Math.random() * 2).toFixed(1)}s ease-in-out infinite`;
      }
      container.appendChild(el);
    }
  }, []);

  const activityItems = [
    { id: "main", icon: Home, label: "Main" },
    { id: "users", icon: Users, label: "Users" },
    { id: "content", icon: Video, label: "Content" },
    { id: "earnings", icon: Euro, label: "Earnings" },
    { id: "operations", icon: Clipboard, label: "Operations" },
    { id: "settings", icon: Cog, label: "Settings" },
  ];

  const MenuItem = ({ href, icon: Icon, children }) => {
    const active = isRouteActive(href);
    return (
      <li className={`vs-menu-item ${active ? "active" : ""}`}>
        <Link to={href} className="vs-menu-link">
          <span className="vs-menu-icon-wrap">
            <Icon size={14} />
          </span>
          <span className="vs-menu-label">{children}</span>
          {active && <span className="vs-active-dot" />}
        </Link>
      </li>
    );
  };

  const DropdownMenuItem = ({ icon: Icon, children, isOpen, onToggle, submenuItems }) => (
    <li className="vs-dropdown-item">
      <div className="vs-dropdown-trigger" onClick={onToggle}>
        <span className="vs-menu-icon-wrap"><Icon size={14} /></span>
        <span className="vs-menu-label">{children}</span>
        <span className={`vs-chevron ${isOpen ? "open" : ""}`}>
          <ChevronRight size={12} />
        </span>
      </div>
      <div className={`vs-submenu-container ${isOpen ? "open" : ""}`}>
        <ul className="vs-submenu">
          {submenuItems.map((item, i) => (
            <li key={i} className={`vs-submenu-item ${isRouteActive(item.href) ? "active" : ""}`}>
              <Link to={item.href} className="vs-submenu-link">
                <item.icon size={12} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );

  const PanelContent = ({ children }) => (
    <div className="vs-panel-body-inner">
      <div className="vs-panel-content" ref={sidebarScrollRef}>
        <nav><div className="vs-section"><ul className="vs-menu-list">{children}</ul></div></nav>
      </div>
      <div className="vs-logout-section">
        <button className="vs-logout-btn" onClick={handleLogout}>
          <LogOut size={14} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        /* ══ ACTIVITY BAR ══ */
        .vs-activity-bar {
          position: fixed; top: 0; left: 0;
          width: 56px; height: 100vh;
          background: #07050f;
          display: flex; flex-direction: column; align-items: center;
          z-index: 1000;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .vs-activity-bar::before {
          content: '';
          position: absolute; top: -60px; left: -30px;
          width: 110px; height: 320px;
          background: linear-gradient(160deg, rgba(180,80,255,0.08) 0%, rgba(244,160,30,0.05) 50%, transparent 100%);
          border-radius: 50%; filter: blur(28px); pointer-events: none;
          animation: driftLight 8s ease-in-out infinite alternate;
        }
        .vs-activity-bar::after {
          content: '';
          position: absolute; bottom: 40px; left: -20px;
          width: 90px; height: 200px;
          background: radial-gradient(ellipse at center, rgba(244,208,63,0.08) 0%, transparent 70%);
          filter: blur(20px); pointer-events: none;
          animation: driftLight 8s ease-in-out infinite alternate-reverse;
        }

        @keyframes driftLight {
          0%   { transform: translateY(0) scale(1); opacity: 0.7; }
          100% { transform: translateY(30px) scale(1.1); opacity: 1; }
        }

        .vs-activity-logo {
          width: 56px; height: 56px;
          display: flex; align-items: center; justify-content: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0; position: relative; z-index: 2;
        }
        .vs-activity-logo img {
          width: 38px; height: 44px; object-fit: contain;
          filter: drop-shadow(0 0 8px rgba(244,208,63,0.4)) drop-shadow(0 0 20px rgba(244,208,63,0.15));
        }

        .vs-activity-nav {
          display: flex; flex-direction: column; align-items: center;
          flex: 1; padding: 10px 0; gap: 1px; width: 100%; position: relative; z-index: 2;
        }

        .vs-activity-btn {
          position: relative; width: 100%; height: 46px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none;
          color: rgba(255,255,255,0.22); cursor: pointer;
          transition: color 0.18s ease;
        }
        .vs-activity-btn:hover { color: rgba(255,255,255,0.7); }
        .vs-activity-btn.active { color: #f4d03f; }

        /* Active left bar */
        .vs-activity-btn.active::before {
          content: '';
          position: absolute; left: 0; top: 10px; bottom: 10px; width: 2px;
          background: linear-gradient(180deg, #ffe066, #f4a800);
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px rgba(244,208,63,0.7), 0 0 16px rgba(244,208,63,0.3);
        }

        .vs-icon-wrap {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 9px;
          transition: background 0.18s ease;
        }
        .vs-activity-btn:hover .vs-icon-wrap { background: rgba(255,255,255,0.05); }
        .vs-activity-btn.active .vs-icon-wrap {
          background: rgba(244,208,63,0.09);
          box-shadow: 0 0 0 1px rgba(244,208,63,0.16);
        }

        /* Tooltip */
        .vs-activity-tooltip {
          position: absolute; left: 62px;
          background: #0d0b1a;
          color: rgba(255,255,255,0.88);
          font-size: 11.5px; font-family: 'Figtree', sans-serif; font-weight: 500;
          padding: 5px 10px; border-radius: 6px;
          white-space: nowrap; pointer-events: none;
          opacity: 0; transform: translateX(-4px);
          transition: opacity 0.15s ease, transform 0.15s ease;
          z-index: 9999;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
        }
        .vs-activity-btn:hover .vs-activity-tooltip { opacity: 1; transform: translateX(0); }

        .vs-activity-bottom {
          padding: 8px 0 14px;
          display: flex; flex-direction: column; align-items: center;
          width: 100%; position: relative; z-index: 2;
        }
        .vs-activity-bottom::before {
          content: ''; display: block; width: 24px; height: 1px;
          background: rgba(255,255,255,0.08); margin: 0 auto 8px;
        }

        /* ══ SIDEBAR PANEL ══ */
        .vs-sidebar-panel {
          position: fixed; top: 0; left: 56px;
          width: 224px; height: 100vh;
          background: linear-gradient(170deg, #0e0a22 0%, #130d30 45%, #0b0820 100%);
          display: flex; flex-direction: column;
          z-index: 999;
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          transition: width 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease;
        }

        /* Right edge shimmer */
        .vs-sidebar-panel::after {
          content: '';
          position: absolute; top: 0; right: 0; width: 1px; height: 100%;
          background: linear-gradient(180deg, transparent 0%, rgba(180,80,255,0.2) 25%, rgba(244,208,63,0.14) 55%, rgba(180,80,255,0.08) 80%, transparent 100%);
          pointer-events: none;
        }

        .vs-sidebar-panel.collapsed { width: 0; opacity: 0; border-right: none; pointer-events: none; }

        /* ── Panel Header ── */
        .vs-panel-header {
          height: 56px;
          display: flex; align-items: center; padding: 0 16px;
          border-bottom: 1px solid rgba(255,255,255,0.055);
          flex-shrink: 0;
          background: rgba(5,3,14,0.5);
          position: relative; z-index: 1;
        }
        .vs-panel-header::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, rgba(244,208,63,0.35) 0%, rgba(180,80,255,0.12) 60%, transparent 100%);
        }
        .vs-panel-title {
          font-size: 9.5px; font-weight: 600;
          letter-spacing: 2.5px; text-transform: uppercase; margin: 0;
          font-family: 'Figtree', sans-serif;
          background: linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(244,208,63,0.75) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          white-space: nowrap;
        }

        /* ── Panel Body ── */
        .vs-panel-body { display: none; flex-direction: column; flex: 1; overflow: hidden; min-height: 0; }
        .vs-panel-body.visible { display: flex; }
        .vs-panel-body-inner { display: flex; flex-direction: column; flex: 1; overflow: hidden; min-height: 0; }

        .vs-panel-content {
          flex: 1; overflow-y: auto; padding: 8px 0 4px;
          scrollbar-width: thin; scrollbar-color: rgba(244,208,63,0.12) transparent;
          position: relative; z-index: 1;
        }
        .vs-panel-content::-webkit-scrollbar { width: 2px; }
        .vs-panel-content::-webkit-scrollbar-track { background: transparent; }
        .vs-panel-content::-webkit-scrollbar-thumb { background: rgba(244,208,63,0.15); border-radius: 2px; }

        .vs-section { margin-bottom: 4px; }

        .vs-section-label {
          font-size: 9px; font-weight: 700;
          color: rgba(244,208,63,0.28); text-transform: uppercase; letter-spacing: 2px;
          padding: 14px 16px 6px; margin: 0;
          font-family: 'Figtree', sans-serif; white-space: nowrap;
        }

        .vs-menu-list { list-style: none; margin: 0; padding: 0 6px; }

        /* ── Menu Items ── */
        .vs-menu-item, .vs-dropdown-item { margin: 1px 0; }

        .vs-menu-link, .vs-dropdown-trigger {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 10px; border-radius: 7px;
          text-decoration: none;
          color: rgba(255,255,255,0.42);
          font-size: 13px; font-weight: 400;
          font-family: 'Figtree', sans-serif;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          user-select: none; white-space: nowrap;
          position: relative;
        }

        .vs-menu-link:hover, .vs-dropdown-trigger:hover {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.82);
        }

        /* Active item */
        .vs-menu-item.active .vs-menu-link {
          background: rgba(244,208,63,0.08);
          color: #f4d03f;
          font-weight: 500;
        }
        .vs-menu-item.active .vs-menu-link:hover { background: rgba(244,208,63,0.11); }

        /* Icon wrap */
        .vs-menu-icon-wrap {
          display: flex; align-items: center; justify-content: center;
          width: 26px; height: 26px; border-radius: 6px; flex-shrink: 0;
          color: rgba(255,255,255,0.28);
          transition: color 0.15s ease, background 0.15s ease;
        }
        .vs-menu-link:hover .vs-menu-icon-wrap,
        .vs-dropdown-trigger:hover .vs-menu-icon-wrap { color: rgba(255,255,255,0.65); }
        .vs-menu-item.active .vs-menu-link .vs-menu-icon-wrap {
          color: #f4d03f;
          background: rgba(244,208,63,0.1);
        }

        .vs-menu-label { flex: 1; overflow: hidden; text-overflow: ellipsis; }

        /* Active dot */
        .vs-active-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #f4d03f;
          box-shadow: 0 0 6px rgba(244,208,63,0.8);
          flex-shrink: 0;
        }

        /* Chevron */
        .vs-chevron {
          margin-left: auto; color: rgba(255,255,255,0.18);
          display: flex; align-items: center; flex-shrink: 0;
          transition: color 0.15s ease, transform 0.22s cubic-bezier(0.4,0,0.2,1);
        }
        .vs-chevron.open { transform: rotate(90deg); color: rgba(244,208,63,0.5); }
        .vs-dropdown-trigger:hover .vs-chevron { color: rgba(255,255,255,0.38); }

        /* Submenu */
        .vs-submenu-container { overflow: hidden; max-height: 0; transition: max-height 0.26s cubic-bezier(0.4,0,0.2,1); }
        .vs-submenu-container.open { max-height: 400px; }

        .vs-submenu {
          list-style: none;
          margin: 2px 0 2px 14px; padding: 3px 0;
          border-left: 1px solid rgba(244,208,63,0.1);
        }
        .vs-submenu-item { margin: 0; }

        .vs-submenu-link {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 12px; border-radius: 0 6px 6px 0;
          text-decoration: none;
          color: rgba(255,255,255,0.36);
          font-size: 12.5px; font-family: 'Figtree', sans-serif;
          transition: background 0.13s ease, color 0.13s ease;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .vs-submenu-link:hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.75); }
        .vs-submenu-item.active .vs-submenu-link {
          background: rgba(244,208,63,0.06);
          color: #f4d03f; font-weight: 500;
        }

        /* ── Logout ── */
        .vs-logout-section {
          padding: 10px 12px 14px;
          flex-shrink: 0; position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .vs-logout-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; width: 100%;
          background: rgba(220,60,60,0.06);
          border: 1px solid rgba(220,60,60,0.16);
          border-radius: 7px;
          color: rgba(255,100,100,0.72);
          font-size: 12.5px; font-family: 'Figtree', sans-serif; font-weight: 500;
          cursor: pointer; text-align: left;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }
        .vs-logout-btn:hover {
          background: rgba(220,60,60,0.12);
          border-color: rgba(255,100,100,0.3);
          color: #ff8080;
        }

        /* ── Sprinkles ── */
        .vs-sprinkles {
          position: absolute; bottom: 0; left: 0;
          width: 100%; height: 55%;
          pointer-events: none; z-index: 0; overflow: hidden;
        }
        .vs-sprinkle { position: absolute; border-radius: 50%; animation: sprinkleFloat linear infinite; opacity: 0; }

        @keyframes sprinkleFloat {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 0; }
          8%   { opacity: 1; }
          85%  { opacity: 0.5; }
          100% { transform: translateY(-260px) rotate(360deg) scale(0.3); opacity: 0; }
        }
        @keyframes sprinkleTwinkle {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50%       { opacity: 0.75; transform: scale(1.5); }
        }
        @keyframes bloomPulse {
          0%   { opacity: 0.5; transform: scale(1); }
          100% { opacity: 0.9; transform: scale(1.06); }
        }
      `}</style>

      {/* ── Activity Bar ── */}
      <div className="vs-activity-bar">
        <div className="vs-activity-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="vs-activity-nav">
          {activityItems.map((item) => (
            <button
              key={item.id}
              className={`vs-activity-btn ${activePanel === item.id ? "active" : ""}`}
              onClick={() => handleActivityClick(item.id)}
              aria-label={item.label}
            >
              <span className="vs-icon-wrap"><item.icon size={18} /></span>
              <span className="vs-activity-tooltip">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="vs-activity-bottom">
          <button className="vs-activity-btn" onClick={handleLogout} aria-label="Logout">
            <span className="vs-icon-wrap"><LogOut size={17} /></span>
            <span className="vs-activity-tooltip">Sign out</span>
          </button>
        </div>
      </div>

      {/* ── Sidebar Panel ── */}
      <div className={`vs-sidebar-panel ${!isPanelOpen ? "collapsed" : ""}`}>
        <div className="vs-panel-header">
          <p className="vs-panel-title">One Trillion Dancers</p>
        </div>

        {/* MAIN */}
        <div className={`vs-panel-body ${activePanel === "main" ? "visible" : ""}`}>
          <PanelContent>
            <MenuItem href="/home" icon={Home}>Dashboard</MenuItem>
            <MenuItem href="/ClassModeration" icon={Video}>Class Listing Approval</MenuItem>
            <MenuItem href="/EventsPage" icon={Ticket}>Events</MenuItem>
            <MenuItem href="/MarketplacePage" icon={Store}>Marketplace</MenuItem>
            <MenuItem href="/studios" icon={Building2}>Studios</MenuItem>
            <MenuItem href="/badges" icon={BadgeCheck}>Badges</MenuItem>
            <MenuItem href="/referrals" icon={Send}>Referrals</MenuItem>
            <MenuItem href="/djevents" icon={Megaphone}>Dj Events</MenuItem>
            <MenuItem href="/beta-testers/bugs" icon={Bug}>Beta Tester Bugs</MenuItem>
          </PanelContent>
        </div>

        {/* USERS */}
        <div className={`vs-panel-body ${activePanel === "users" ? "visible" : ""}`}>
          <PanelContent>
            <DropdownMenuItem icon={Users} isOpen={userDropdownOpen} onToggle={() => setUserDropdownOpen(p => !p)} submenuItems={userSubmenuItems}>Users</DropdownMenuItem>
            <DropdownMenuItem icon={Users} isOpen={applicantDropdownOpen} onToggle={() => setApplicantDropdownOpen(p => !p)} submenuItems={applicantSubmenuItems}>Applicants</DropdownMenuItem>
          </PanelContent>
        </div>

        {/* CONTENT */}
        <div className={`vs-panel-body ${activePanel === "content" ? "visible" : ""}`}>
          <PanelContent>
            <DropdownMenuItem icon={Video} isOpen={contentDropdownOpen} onToggle={() => setContentDropdownOpen(p => !p)} submenuItems={contentSubmenuItems}>Content Moderation</DropdownMenuItem>
            <MenuItem href="/ClassModeration" icon={Video}>Class Listing Approval</MenuItem>
          </PanelContent>
        </div>

        {/* EARNINGS */}
        <div className={`vs-panel-body ${activePanel === "earnings" ? "visible" : ""}`}>
          <PanelContent>
            <DropdownMenuItem icon={Euro} isOpen={earningDropdownOpen} onToggle={() => setEarningDropdownOpen(p => !p)} submenuItems={earningSubmenuItems}>Earnings & Payouts</DropdownMenuItem>
          </PanelContent>
        </div>

        {/* OPERATIONS */}
        <div className={`vs-panel-body ${activePanel === "operations" ? "visible" : ""}`}>
          <PanelContent>
            <DropdownMenuItem icon={Clipboard} isOpen={operationDropdownOpen} onToggle={() => setOperationDropdownOpen(p => !p)} submenuItems={operationSubmenuItems}>Operations & Support</DropdownMenuItem>
          </PanelContent>
        </div>

        {/* SETTINGS */}
        <div className={`vs-panel-body ${activePanel === "settings" ? "visible" : ""}`}>
          <PanelContent>
            <MenuItem href="/NotificationPage" icon={Bell}>Notifications</MenuItem>
            <MenuItem href="/SettingsPage" icon={Cog}>Settings</MenuItem>
          </PanelContent>
        </div>

        <div className="vs-sprinkles" ref={sprinklesRef} />
      </div>
    </>
  );
};

export default Sidebar;