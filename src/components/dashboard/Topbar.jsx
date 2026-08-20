import { Menu, Bell, ChevronDown, LogOut, User, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import './Topbar.css';

const Topbar = ({ title, onMenuClick }) => {
  const { unreadCount = 0 } = useNotifications() || {};
  const { user, logout } = useAuth() || {};

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Dynamic user details with fallback
  const userName = user?.name || 'Radhika Sharma';
  const userEmail = user?.email || 'radhika@example.com';
  
  // Get Initials from Name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Close dropdown on outside click or 'Escape' key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setOpen(false);
      if (logout) await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="topbar">
      {/* Left Section */}
      <div className="topbar-left">
        <button
          className="topbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="topbar-title-wrapper">
          <h1 className="topbar-title">{title}</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="topbar-right">
        {/* Notifications Icon */}
        <Link
          to="/dashboard/notifications"
          className="topbar-action-btn"
          aria-label={`Notifications ${unreadCount ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="topbar-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="topbar-divider" />

        {/* User Profile Dropdown */}
        <div className="topbar-profile-wrapper" ref={dropdownRef}>
          <button
            className={`topbar-profile-btn ${open ? 'active' : ''}`}
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-haspopup="true"
            type="button"
          >
            <div className="topbar-avatar">
              {getInitials(userName)}
            </div>

            <div className="topbar-user-info">
              <span className="topbar-name">{userName}</span>
              <span className="topbar-role">Pro Member</span>
            </div>

            <ChevronDown
              size={16}
              className={`profile-chevron ${open ? 'rotate' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-user-name">{userName}</p>
                <p className="dropdown-user-email">{userEmail}</p>
              </div>

              <div className="dropdown-divider" />

              <Link
                to="/dashboard/profile"
                className="dropdown-item"
                onClick={() => setOpen(false)}
              >
                <User size={18} />
                <span>My Profile</span>
              </Link>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
