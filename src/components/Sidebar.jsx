import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import './Sidebar.css';

// Import all icons
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
} from 'lucide-react';

const Sidebar = () => {
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const sidebarScrollRef = useRef(null);

  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [earningDropdownOpen, setEarningDropdownOpen] = useState(false);
  const [operationDropdownOpen, setOperationDropdownOpen] = useState(false);
  const [applicantDropdownOpen, setApplicantDropdownOpen] = useState(false);
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);

  // ========== MENU ITEMS CONFIGURATION ==========
  const userSubmenuItems = [
    { href: '/users/Dancers', icon: User, label: 'Dancers' },
    { href: '/users/Professors', icon: GraduationCap, label: 'Instructors' },
    { href: '/users/DJs', icon: Disc, label: 'D.Js' },
    { href: '/users/Organizers', icon: FileEdit, label: 'Organizers' },
  ];

  const applicantSubmenuItems = [
    { href: '/Applicants/Professors', icon: GraduationCap, label: 'Instructors' },
    { href: '/Applicants/DJs', icon: Disc, label: 'D.Js' },
    { href: '/Applicants/Organizers', icon: FileEdit, label: 'Organizers' },
  ];

  const contentSubmenuItems = [
    { href: '/FeedPage', icon: Film, label: 'User Generated Content' },
    { href: '/VideoPrograms', icon: Book, label: 'Video Program Management' },
    { href: '/playlists', icon: Play, label: 'Playlists' },
    { href: '/CreateChallenge', icon: Swords, label: 'Challenges' },
  ];

  const earningSubmenuItems = [
    { href: '/payouts/earnings', icon: Wallet, label: 'Earnings' },
    { href: '/payouts/payouts', icon: Banknote, label: 'Payouts' },
  ];

  const operationSubmenuItems = [
    { href: '/support/ticket-raise', icon: FileEdit, label: 'Ticket Raise' },
  ];

  // ========== EVENT HANDLERS ==========

  /**
   * Handle logout and redirect to home
   */
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  /**
   * Close sidebar on mobile when menu item is clicked
   * Uses isMobile hook instead of direct window.innerWidth check
   */
  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  /**
   * Check if current route matches given path
   */
  const isRouteActive = (href) => location.pathname === href;

  /**
   * Check if any submenu item is active
   */
  const isSubmenuActive = (items) =>
    items.some((item) => location.pathname === item.href);

  // ========== EFFECTS ==========

  /**
   * Auto-open dropdowns when submenu item is active
   * Improves UX by showing context of current page
   */
  useEffect(() => {
    if (isSubmenuActive(userSubmenuItems)) setUserDropdownOpen(true);
    if (isSubmenuActive(applicantSubmenuItems)) setApplicantDropdownOpen(true);
    if (isSubmenuActive(contentSubmenuItems)) setContentDropdownOpen(true);
    if (isSubmenuActive(earningSubmenuItems)) setEarningDropdownOpen(true);
    if (isSubmenuActive(operationSubmenuItems)) setOperationDropdownOpen(true);
  }, [location.pathname]);

  /**
   * Save sidebar scroll position in session storage
   * Restores scroll position when navigating back
   */
  useEffect(() => {
    const sidebar = sidebarScrollRef.current;
    if (!sidebar) return;

    const savedScroll = sessionStorage.getItem('sidebar-scroll');
    if (savedScroll !== null) {
      sidebar.scrollTop = Number(savedScroll);
    }

    const handleScroll = () => {
      sessionStorage.setItem('sidebar-scroll', sidebar.scrollTop);
    };

    sidebar.addEventListener('scroll', handleScroll);
    return () => {
      sidebar.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  /**
   * Close sidebar when switching to desktop view
   * Prevents sidebar being stuck open on resize
   */
  useEffect(() => {
    if (!isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // ========== SUBCOMPONENTS ==========

  /**
   * MenuItem Component
   * Simple navigation link item
   */
  const MenuItem = ({ href, icon: Icon, children }) => (
    <li className={`menu-item ${isRouteActive(href) ? 'active' : ''}`}>
      <Link to={href} className="menu-link" onClick={handleMenuItemClick}>
        <Icon size={18} className="menu-icon" />
        <span>{children}</span>
      </Link>
    </li>
  );

  /**
   * DropdownMenuItem Component
   * Collapsible menu item with submenu
   */
  const DropdownMenuItem = ({
    icon: Icon,
    children,
    isOpen,
    onToggle,
    submenuItems,
  }) => (
    <li className="dropdown-item">
      <div className="dropdown-trigger" onClick={onToggle}>
        <Icon size={18} className="menu-icon" />
        <span>{children}</span>
        <div className={`chevron ${isOpen ? 'open' : ''}`}>
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </div>
      <div className={`submenu-container ${isOpen ? 'open' : ''}`}>
        <ul className="submenu">
          {submenuItems.map((item, index) => (
            <li
              key={index}
              className={`submenu-item ${
                isRouteActive(item.href) ? 'active' : ''
              }`}
            >
              <Link
                to={item.href}
                className="submenu-link"
                onClick={handleMenuItemClick}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );

  // ========== RENDER ==========

  return (
    <>
      {/* Mobile Hamburger Button - Only show on mobile */}
      {isMobile && !isSidebarOpen && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <img
                src={logo}
                alt="Dance with me Logo"
                className="logo-image"
              />
            </div>
            <div>
              <h2 className="app-title">Dance with me</h2>
              <p className="app-subtitle">Admin Panel</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              className="sidebar-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="sidebar-content" ref={sidebarScrollRef}>
          <nav className="sidebar-nav">
            {/* MAIN SECTION */}
            <div className="menu-section">
              <p className="menu-section-title">Main</p>
              <ul className="menu-list">
                <MenuItem href="/home" icon={Home}>
                  Dashboard
                </MenuItem>

                <DropdownMenuItem
                  icon={Users}
                  isOpen={userDropdownOpen}
                  onToggle={() => setUserDropdownOpen(!userDropdownOpen)}
                  submenuItems={userSubmenuItems}
                >
                  Users
                </DropdownMenuItem>

                <DropdownMenuItem
                  icon={Users}
                  isOpen={applicantDropdownOpen}
                  onToggle={() =>
                    setApplicantDropdownOpen(!applicantDropdownOpen)
                  }
                  submenuItems={applicantSubmenuItems}
                >
                  Applicants
                </DropdownMenuItem>

                <DropdownMenuItem
                  icon={Video}
                  isOpen={contentDropdownOpen}
                  onToggle={() => setContentDropdownOpen(!contentDropdownOpen)}
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

                <MenuItem href="/studios" icon={Building2}>
                  Studios
                </MenuItem>

                <DropdownMenuItem
                  icon={Euro}
                  isOpen={earningDropdownOpen}
                  onToggle={() =>
                    setEarningDropdownOpen(!earningDropdownOpen)
                  }
                  submenuItems={earningSubmenuItems}
                >
                  Earnings & Payouts
                </DropdownMenuItem>

                <DropdownMenuItem
                  icon={Clipboard}
                  isOpen={operationDropdownOpen}
                  onToggle={() =>
                    setOperationDropdownOpen(!operationDropdownOpen)
                  }
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

                <MenuItem href="/djevents" icon={Megaphone}>
                  Dj Events
                </MenuItem>

                <MenuItem href="/beta-testers/bugs" icon={Bug}>
                  Beta Tester Bugs
                </MenuItem>
              </ul>
            </div>

            {/* SETTINGS SECTION */}
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

        {/* Logout Section */}
        <div className="logout-section">
          <button className="logout-link" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
