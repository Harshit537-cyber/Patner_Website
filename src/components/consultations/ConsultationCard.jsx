import Badge from '../common/Badge';
import { formatDateTime, formatCurrency } from '../../utils/formatters';

const statusTone = { upcoming: 'neutral', completed: 'success', cancelled: 'error' };

const ConsultationCard = ({ consultation }) => (
  <div className="page-card" style={{ marginBottom: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontWeight: 700, color: 'var(--color-heading)', margin: '0 0 4px' }}>{consultation.customer}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
          {consultation.type} · {formatDateTime(consultation.date)}
        </p>
      </div>
      <Badge tone={statusTone[consultation.status] || 'neutral'}>{consultation.status}</Badge>
    </div>
    <div style={{ marginTop: 12, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
      {formatCurrency(consultation.amount)}
    </div>
  </div>
);

export default ConsultationCard;
