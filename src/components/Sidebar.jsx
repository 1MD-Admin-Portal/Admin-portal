import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Add this import - replace with your actual logo filename
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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [earningDropdownOpen, setEarningDropdownOpen] = useState(false);
  const [operationDropdownOpen, setOperationDropdownOpen] = useState(false);
  const [applicantDropdownOpen, setApplicantDropdownOpen] = useState(false);
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/home");
  const { logout } = useAuth(); // now this will exist ✅

  const handleLogout = () => {
    logout(); // clear token
    navigate("/", { replace: true }); // redirect
  };

  const toggleContentDropdown = () =>
    setContentDropdownOpen(!contentDropdownOpen);
  const toggleOperationDropdown = () =>
    setOperationDropdownOpen(!operationDropdownOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const toggleApplicantDropdown = () =>
    setApplicantDropdownOpen(!applicantDropdownOpen);
  const toggleEarningDropdown = () =>
    setEarningDropdownOpen(!earningDropdownOpen);

  const MenuItem = ({
    href,
    icon: Icon,
    children,
    isActive = false,
    onClick,
  }) => (
    <li className={`menu-item ${isActive ? "active" : ""}`} onClick={onClick}>
      <Link to={href} className="menu-link">
        <Icon size={18} />
        <span>{children}</span>
      </Link>
    </li>
  );

  const DropdownMenuItem = ({
    icon: Icon,
    children,
    isOpen,
    onToggle,
    submenuItems,
  }) => (
    <li className="dropdown-item">
      <div className="dropdown-trigger" onClick={onToggle}>
        <Icon size={18} />
        <span>{children}</span>
        <div className={`chevron ${isOpen ? "open" : ""}`}>
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </div>
      <div className={`submenu-container ${isOpen ? "open" : ""}`}>
        <ul className="submenu">
          {submenuItems.map((item, index) => (
            <li key={index} className="submenu-item">
              <Link to={item.href} className="submenu-link">
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );

  const userSubmenuItems = [
    { href: "/users/Dancers", icon: User, label: "Dancers" },
    { href: "/users/Professors", icon: GraduationCap, label: "Professors" },
    { href: "/users/DJs", icon: Disc, label: "D.Js" },
    { href: "/users/Organizers", icon: FileEdit, label: "Organizers" },
  ];

  const applicantSubmenuItems = [
    {
      href: "/Applicants/Professors",
      icon: GraduationCap,
      label: "Professors",
    },
    { href: "/Applicants/DJs", icon: Disc, label: "D.Js" },
    { href: "/Applicants/Organizers", icon: FileEdit, label: "Organizers" },
  ];

  const contentSubmenuItems = [
    { href: "/FeedPage", icon: Film, label: "User Generated Content" },
    { href: "/VideoPrograms", icon: Book, label: "Video Program Management" },
    { href: "/playlists", icon: Play, label: "Playlists" },
    { href: "/CreateChallenge", icon: Swords, label: "Challenges" },
    {
      href: "/Challenge-Submissions",
      icon: Download,
      label: "Challenge Submission",
    },
    {
      href: "/Challenge-participants",
      icon: PersonStanding,
      label: "Challenge Participants",
    },
  ];

  const earningSubmenuItems = [
    { href: "/payouts/earnings", icon: Wallet, label: "Earnings" },
    { href: "/payouts/payouts", icon: Banknote, label: "Payouts" },
    { href: "/payouts/disputes", icon: Gavel, label: "Disputes" },
    { href: "/payouts/payoutslabs", icon: BarChart, label: "Payout Slabs" },
  ];

  const operationSubmenuItems = [
    {
      href: "/support/class-disputes",
      icon: GraduationCap,
      label: "Class Related Dispute",
    },
    { href: "/support/ticket-raise", icon: FileEdit, label: "Ticket Raise" },
    {
      href: "/support/redemption-spotlight",
      icon: Search,
      label: "Redemption & Spotlight",
    },
  ];

  return (
    <div className="sidebar-container">
      <style>{`
        .sidebar-container {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 280px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          display: flex;
          flex-direction: column;
          z-index: 100;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 12px;
        }

        .app-title {
          font-size: 20px;
          font-weight: 700;
          color: #f4d03f;
          margin: 0;
          line-height: 1.2;
          background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .app-subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        .sidebar-content::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .menu-section {
          margin-bottom: 32px;
        }

        .menu-section-title {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 0 20px 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .menu-item, .dropdown-item {
          margin: 2px 12px;
        }

        .menu-link, .dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .menu-link::before, .dropdown-trigger::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(244, 208, 63, 0.1) 0%, rgba(212, 175, 55, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px;
        }

        .menu-link:hover, .dropdown-trigger:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .menu-link:hover::before, .dropdown-trigger:hover::before {
          opacity: 1;
        }

        .menu-item.active .menu-link {
          background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(212, 175, 55, 0.15) 100%);
          color: #f4d03f;
          border: 1px solid rgba(244, 208, 63, 0.3);
          box-shadow: 0 4px 15px rgba(244, 208, 63, 0.1);
        }

        .chevron {
          margin-left: auto;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .chevron.open {
          color: #f4d03f;
          transform: rotate(0deg);
        }

        .submenu-container {
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 0;
        }

        .submenu-container.open {
          max-height: 300px;
        }

        .submenu {
          list-style: none;
          margin: 8px 0 0;
          padding: 0;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .submenu-item {
          margin: 0;
        }

        .submenu-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 500;
          border-radius: 6px;
          margin: 4px 8px;
          transition: all 0.3s ease;
        }

        .submenu-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(4px);
        }

        .logout-section {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.1);
        }

        .logout-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-decoration: none;
          color: #ff6b6b;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-weight: 500;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.2);
        }

        .logout-link:hover {
          background: rgba(255, 107, 107, 0.2);
          transform: translateX(4px);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
        }

        .menu-icon {
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.3s ease;
        }

        .menu-link:hover .menu-icon,
        .dropdown-trigger:hover .menu-icon {
          color: #f4d03f;
        }

        .menu-item.active .menu-icon {
          color: #f4d03f;
        }
      `}</style>

      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">
            <img src={logo} alt="Dance with me Logo" className="logo-image" />
          </div>
          <div>
            <h2 className="app-title">Dance with me</h2>
            <p className="app-subtitle">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="menu-section">
            <p className="menu-section-title">Main</p>
            <ul className="menu-list">
              <MenuItem
                href="/home"
                icon={Home}
                isActive={activeItem === "/home"}
                onClick={() => setActiveItem("/home")}
              >
                Dashboard
              </MenuItem>

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

              <DropdownMenuItem
                icon={Video}
                isOpen={contentDropdownOpen}
                onToggle={toggleContentDropdown}
                submenuItems={contentSubmenuItems}
              >
                Content Moderation
              </DropdownMenuItem>

              <MenuItem href="/ClassModeration" icon={Video}>
                Class Listing Approval
              </MenuItem>

              <MenuItem href="/EventsPage" icon={Ticket}>
                Events
              </MenuItem>

              <MenuItem href="/MarketplacePage" icon={Store}>
                Marketplace
              </MenuItem>

              <DropdownMenuItem
                icon={Euro}
                isOpen={earningDropdownOpen}
                onToggle={toggleEarningDropdown}
                submenuItems={earningSubmenuItems}
              >
                Earnings & Payouts
              </DropdownMenuItem>

              <DropdownMenuItem
                icon={Clipboard}
                isOpen={operationDropdownOpen}
                onToggle={toggleOperationDropdown}
                submenuItems={operationSubmenuItems}
              >
                Operation & Support
              </DropdownMenuItem>

              <MenuItem href="/badges" icon={BadgeCheck}>
                Badges
              </MenuItem>

              <MenuItem href="/referrals" icon={Send}>
                Referrals
              </MenuItem>

              <MenuItem href="/AdsManagement" icon={Megaphone}>
                Ads Management
              </MenuItem>
            </ul>
          </div>

          <div className="menu-section">
            <p className="menu-section-title">Settings</p>
            <ul className="menu-list">
              <MenuItem href="/NotificationPage" icon={Bell}>
                Notifications
              </MenuItem>
              <MenuItem href="/SettingsPage" icon={Cog}>
                Settings
              </MenuItem>
            </ul>
          </div>
        </nav>
      </div>

      <div className="logout-section">
        <button className="logout-link" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
