import Badge from '../common/Badge';

const ProfileHeader = ({ name, specialization, rating }) => (
  <div className="page-card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-soft-purple-bg)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700 }}>
      {name.split(' ').map((n) => n[0]).join('')}
    </div>
    <div>
      <h2 style={{ margin: '0 0 6px' }}>{name}</h2>
      <p style={{ margin: '0 0 8px', color: 'var(--color-muted)' }}>{specialization}</p>
      <Badge tone="gold">★ {rating} rating</Badge>
    </div>
  </div>
);

export default ProfileHeader;
