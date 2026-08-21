import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { DASHBOARD_NAV } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = ({ open, onClose }) => {
  const [isOnline, setIsOnline] = useState(true);
  const location = useLocation();

  const isLiveItem = (item) => {
    const text = `${item.key || ''} ${item.path || ''} ${item.label || ''}`.toLowerCase();
    return text.includes('live') || text.includes('stream') || Boolean(item.isLive);
  };

  const isChatItem = (item) => {
    const text = `${item.key || ''} ${item.path || ''} ${item.label || ''}`.toLowerCase();
    return text.includes('chat') || text.includes('message') || text.includes('inbox') || text.includes('consult');
  };

  const isNotificationItem = (item) => {
    const text = `${item.key || ''} ${item.path || ''} ${item.label || ''}`.toLowerCase();
    return text.includes('notification') || text.includes('alert') || text.includes('notice');
  };

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`astral-sidebar ${open ? 'sidebar-visible' : ''}`}>
        <div className="sidebar-ambient-glow" />

        <div className="sidebar-header-box">
          <Link to="/dashboard" className="astral-brand" onClick={onClose}>
            <div className="brand-orbit-wrapper">
              <div className="orbit-ring" />
              <div className="brand-logo-core">
                <Icons.Sparkles size={24} className="astro-star" />
              </div>
            </div>
            <div className="brand-details">
              <div className="brand-title">
                Astro<span>Narhari</span>
              </div>
              <div className="brand-subtitle">
                <Icons.Crown size={12} className="crown-icon" />
                <span>ELITE PARTNER</span>
              </div>
            </div>
          </Link>

          <button 
            type="button" 
            className={`online-status-chip ${isOnline ? 'is-online' : 'is-offline'}`}
            onClick={() => setIsOnline(!isOnline)}
            title="Click to toggle availability"
          >
            <span className="status-beacon">
              <span className="beacon-core"></span>
              <span className="beacon-wave"></span>
            </span>
            <span className="status-label">
              {isOnline ? 'Online for Consult' : 'Offline'}
            </span>
          </button>
        </div>

        <div className="sidebar-scroll-area">
          <div className="nav-group-label">MAIN NAVIGATION</div>

          <nav className="astral-nav-list">
            {DASHBOARD_NAV.map((item, index) => {
              const IconComponent = Icons[item.icon] || Icons.Compass;
              const isLive = isLiveItem(item);
              const isChat = isChatItem(item);
              const isNotif = isNotificationItem(item);

              return (
                <NavLink
                  key={item.key || index}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `astral-nav-item ${isActive ? 'item-active' : ''} ${
                      isLive ? 'item-live-special' : ''
                    }`
                  }
                  onClick={onClose}
                  style={{ '--i': index }}
                >
                  <div className={`nav-icon-pod ${isNotif ? 'icon-bell-animated' : ''} ${isChat ? 'icon-chat-animated' : ''}`}>
                    <IconComponent size={19} className="main-icon" />
                    {isLive && <span className="icon-pulse-halo" />}
                    {isNotif && <span className="notif-ring-dot" />}
                  </div>

                  <span className="nav-item-title">{item.label}</span>

                  {isLive && (
                    <div className="live-broadcast-pill">
                      <div className="equalizer-bars">
                        <span className="eq-bar bar-1"></span>
                        <span className="eq-bar bar-2"></span>
                        <span className="eq-bar bar-3"></span>
                      </div>
                      <span className="live-text-tag">LIVE</span>
                    </div>
                  )}

                  {isChat && (
                    <div className="minimal-indicator-wrap">
                      {item.badge ? (
                        <span className="count-badge">{item.badge}</span>
                      ) : (
                        <span className="breathing-dot chat-dot"></span>
                      )}
                    </div>
                  )}

                  {isNotif && (
                    <div className="minimal-indicator-wrap">
                      {item.badge ? (
                        <span className="count-badge">{item.badge}</span>
                      ) : (
                        <span className="breathing-dot notif-dot"></span>
                      )}
                    </div>
                  )}

                  {!isLive && !isChat && !isNotif && (
                    <Icons.ChevronRight size={14} className="nav-arrow-hint" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer-pod">
          <div className="partner-mini-card">
            <div className="card-top">
              <div className="astrologer-avatar-box">
                <Icons.UserCheck size={16} />
              </div>
              <div className="partner-meta">
                <span className="astrologer-name">Master Narhari</span>
                <span className="astrologer-tier">✦ Emerald Astrologer</span>
              </div>
            </div>
            <div className="rating-row">
              <div className="rating-pill">
                <Icons.Star size={11} className="star-green" />
                <span>4.9 / 5.0</span>
              </div>
              <span className="consults-count">1.4k+ Calls</span>
            </div>
          </div>

          <Link to="/" className="portal-exit-btn">
            <div className="exit-icon-wrap">
              <Icons.Globe size={16} />
            </div>
            <span>Visit Client Portal</span>
            <Icons.ExternalLink size={14} className="launch-icon" />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;