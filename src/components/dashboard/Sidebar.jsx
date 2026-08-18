import { Link, NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { DASHBOARD_NAV } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = ({ open, onClose }) => (
  <>
    {open && <div className="sidebar-scrim" onClick={onClose} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <Link to="/dashboard" className="sidebar-logo">
        ✦ AstroNarhari <span>Partner</span>
      </Link>
      <nav className="sidebar-nav">
        {DASHBOARD_NAV.map((item) => {
          const Icon = Icons[item.icon] || Icons.Circle;
          return (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <Link to="/" className="sidebar-link">
          <Icons.Globe size={18} /> Visit website
        </Link>
      </div>
    </aside>
  </>
);

export default Sidebar;
