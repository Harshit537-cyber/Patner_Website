import Badge from '../common/Badge';
import { formatDateTime, formatCurrency } from '../../utils/formatters';

const statusTone = {
  pending: 'neutral',
  accepted: 'success',
  rejected: 'error',
};

const ConsultationCard = ({ consultation }) => (
  <div className="page-card" style={{ marginBottom: 12 }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <p
          style={{
            fontWeight: 700,
            color: 'var(--color-heading)',
            margin: '0 0 4px',
          }}
        >
          {consultation.user?.name || 'Unknown'}
        </p>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-muted)',
            margin: 0,
          }}
        >
          {consultation.mode || '-'} ·{' '}
          {formatDateTime(consultation.date)}
        </p>
      </div>

      <Badge tone={statusTone[consultation.status] || 'neutral'}>
        {consultation.status}
      </Badge>
    </div>

    <div
      style={{
        marginTop: 12,
        fontSize: '0.85rem',
        color: 'var(--color-muted)',
      }}
    >
      {consultation.timeSlot || '-'} · {consultation.duration || 0} min
    </div>

    <div
      style={{
        marginTop: 8,
        fontWeight: 700,
        color: 'var(--color-primary-dark)',
      }}
    >
      {formatCurrency(consultation.totalFee || 0)}
    </div>
  </div>
);

export default ConsultationCard;