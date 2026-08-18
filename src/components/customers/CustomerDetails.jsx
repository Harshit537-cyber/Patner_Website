import { formatDate } from '../../utils/formatters';

const CustomerDetails = ({ customer }) => (
  <div className="page-card">
    <h2 style={{ marginTop: 0 }}>{customer.name}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.92rem', marginTop: 12 }}>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>Total consultations</strong>{customer.consultations}</div>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>Last visit</strong>{formatDate(customer.lastVisit)}</div>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>Rating given</strong>★ {customer.rating}</div>
    </div>
  </div>
);

export default CustomerDetails;
