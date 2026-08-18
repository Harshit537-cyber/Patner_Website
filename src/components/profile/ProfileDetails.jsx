const ProfileDetails = ({ profile }) => (
  <div className="page-card">
    <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Profile details</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.92rem', marginTop: 12 }}>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>City</strong>{profile.city || '—'}</div>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>Language</strong>{profile.language || '—'}</div>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>Experience</strong>{profile.experience || '—'}</div>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>Bio</strong>{profile.bio || '—'}</div>
    </div>
  </div>
);

export default ProfileDetails;
