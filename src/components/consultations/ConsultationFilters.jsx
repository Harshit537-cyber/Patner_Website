const filters = ['all', 'pending', 'accepted', 'rejected'];

const ConsultationFilters = ({ active, onChange }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {filters.map((f) => (
      <button
        key={f}
        onClick={() => onChange(f)}
        style={{
          padding: '8px 16px',
          borderRadius: 999,
          border: '1px solid var(--color-border)',
          background:
            active === f
              ? 'var(--color-primary)'
              : 'var(--color-card)',
          color: active === f ? '#fff' : 'var(--color-text)',
          fontSize: '0.85rem',
          fontWeight: 600,
          textTransform: 'capitalize',
          cursor: 'pointer',
        }}
      >
        {f}
      </button>
    ))}
  </div>
);

export default ConsultationFilters;