import './EmptyState.css';

const EmptyState = ({ icon = '✦', title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h4>{title}</h4>
    {description && <p>{description}</p>}
    {action}
  </div>
);

export default EmptyState;
