const TimeSlot = ({ time, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px 6px',
      borderRadius: 8,
      border: '1px solid var(--color-border)',
      background: selected ? 'var(--color-primary)' : 'var(--color-card)',
      color: selected ? '#fff' : 'var(--color-text)',
      fontSize: '0.85rem',
      fontWeight: 600,
    }}
  >
    {time}
  </button>
);

export default TimeSlot;
