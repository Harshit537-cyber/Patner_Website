import { Link } from 'react-router-dom';
import { CalendarPlus, Wallet2, UserCog, MessageSquarePlus } from 'lucide-react';
import './Widgets.css';

const actions = [
  { icon: CalendarPlus, label: 'Update availability', path: '/dashboard/calendar' },
  { icon: Wallet2, label: 'Withdraw earnings', path: '/dashboard/wallet' },
  { icon: MessageSquarePlus, label: 'View messages', path: '/dashboard/messages' },
  { icon: UserCog, label: 'Edit profile', path: '/dashboard/profile' },
];

const QuickActions = () => (
  <div className="widget-card">
    <div className="widget-card-header">
      <h3>Quick actions</h3>
    </div>
    <div className="quick-actions-grid">
      {actions.map(({ icon: Icon, label, path }) => (
        <Link to={path} key={label} className="quick-action-btn">
          <Icon size={20} />
          {label}
        </Link>
      ))}
    </div>
  </div>
);

export default QuickActions;
