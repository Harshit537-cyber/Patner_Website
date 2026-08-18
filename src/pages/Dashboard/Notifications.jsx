import { useNotifications } from '../../hooks/useNotifications';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';

const Notifications = () => {
  const { notifications } = useNotifications();

  return (
    <div className="page-card">
      <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Notifications</h2>
      {notifications.length === 0 ? (
        <EmptyState title="You're all caught up" description="New notifications will appear here." />
      ) : (
        notifications.map((n) => (
          <div key={n.id} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'var(--color-border)' : 'var(--color-primary)', marginTop: 6 }} />
            <div>
              <p style={{ margin: 0, fontWeight: n.read ? 500 : 700, color: 'var(--color-heading)' }}>{n.title}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-muted)' }}>{formatDateTime(n.date)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
