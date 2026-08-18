import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatters';
import './Widgets.css';

const UpcomingConsultations = ({ items = [] }) => (
  <div className="widget-card">
    <div className="widget-card-header">
      <h3>Upcoming consultations</h3>
      <Link to="/dashboard/consultations">View all</Link>
    </div>
    {items.length === 0 && <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>Nothing scheduled yet.</p>}
    {items.map((item) => (
      <div className="upcoming-row" key={item.id}>
        <div className="upcoming-row-main">
          <span className="upcoming-avatar">{item.customer.split(' ').map((n) => n[0]).join('')}</span>
          <div>
            <p className="upcoming-name">{item.customer}</p>
            <p className="upcoming-meta">{item.type} consultation</p>
          </div>
        </div>
        <span className="upcoming-time">{formatDateTime(item.date)}</span>
      </div>
    ))}
  </div>
);

export default UpcomingConsultations;
