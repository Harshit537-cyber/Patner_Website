const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CalendarView = ({ workingDays = [] }) => (
  <div className="page-card">
    <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Weekly availability</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, marginTop: 16 }}>
      {DAYS.map((day) => {
        const active = workingDays.includes(day);
        return (
          <div
            key={day}
            style={{
              padding: '18px 8px',
              textAlign: 'center',
              borderRadius: 10,
              background: active ? 'var(--color-soft-purple-bg)' : 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              color: active ? 'var(--color-primary-dark)' : 'var(--color-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            {day}
          </div>
        );
      })}
    </div>
  </div>
);

export default CalendarView;
