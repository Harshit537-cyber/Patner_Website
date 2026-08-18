import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Widgets.css';

const RecentTransactions = ({ items = [] }) => (
  <div className="widget-card">
    <div className="widget-card-header">
      <h3>Recent transactions</h3>
      <Link to="/dashboard/wallet">View wallet</Link>
    </div>
    {items.length === 0 && <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>No transactions yet.</p>}
    {items.map((item, i) => (
      <div className="transaction-row" key={i}>
        <div>
          <p className="transaction-desc" style={{ margin: 0 }}>{item.description}</p>
          <span className="transaction-date">{formatDate(item.date)}</span>
        </div>
        <span className="transaction-amount">+{formatCurrency(item.amount)}</span>
      </div>
    ))}
  </div>
);

export default RecentTransactions;
