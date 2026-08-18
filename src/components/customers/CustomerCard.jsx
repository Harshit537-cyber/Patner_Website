const CustomerCard = ({ customer }) => (
  <div className="page-card" style={{ marginBottom: 12 }}>
    <p style={{ fontWeight: 700, margin: '0 0 4px', color: 'var(--color-heading)' }}>{customer.name}</p>
    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
      {customer.consultations} consultations · ★ {customer.rating}
    </p>
  </div>
);

export default CustomerCard;
