import './StatCard.css';

const StatCard = ({ icon: Icon, label, value, delta, tone = 'primary' }) => (
  <div className="stat-card">
    <div className={`stat-card-icon stat-card-icon-${tone}`}>
      <Icon size={20} />
    </div>
    <p className="stat-card-label">{label}</p>
    <p className="stat-card-value">{value}</p>
    {delta && <span className="stat-card-delta">{delta}</span>}
  </div>
);

export default StatCard;
