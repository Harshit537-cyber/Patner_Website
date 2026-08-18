import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import { DASHBOARD_NAV } from '../../utils/constants';
import './Dashboard.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const activeNav = DASHBOARD_NAV.find((n) =>
    n.path === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(n.path)
  );

  return (
    <div className="dashboard-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <Topbar title={activeNav?.label || 'Dashboard'} onMenuClick={() => setSidebarOpen(true)} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
