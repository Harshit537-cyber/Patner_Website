import Badge from '../common/Badge';
import { formatDateTime, formatCurrency } from '../../utils/formatters';

const statusTone = { upcoming: 'neutral', completed: 'success', cancelled: 'error' };

const ConsultationDetails = ({ consultation }) => (
  <div className="page-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h2 style={{ margin: '0 0 4px' }}>{consultation.customer}</h2>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>Consultation #{consultation.id}</p>
      </div>
      <Badge tone={statusTone[consultation.status] || 'neutral'}>{consultation.status}</Badge>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.92rem' }}>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>Type</strong>{consultation.type}</div>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>Date & time</strong>{formatDateTime(consultation.date)}</div>
      <div><strong style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem' }}>Amount</strong>{formatCurrency(consultation.amount)}</div>
    </div>
  </div>
);

export default ConsultationDetails;
