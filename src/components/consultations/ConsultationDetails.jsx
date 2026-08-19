import Badge from '../common/Badge';
import { formatDateTime, formatCurrency } from '../../utils/formatters';

const statusTone = {
  pending: 'neutral',
  accepted: 'success',
  rejected: 'error',
};

const ConsultationDetails = ({ consultation }) => {
  if (!consultation) {
    return null;
  }

  return (
    <div className="page-card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 4px' }}>
            {consultation.user?.name || 'Unknown'}
          </h2>

          <p
            style={{
              color: 'var(--color-muted)',
              margin: 0,
            }}
          >
            Consultation #{consultation._id}
          </p>
        </div>

        <Badge tone={statusTone[consultation.status] || 'neutral'}>
          {consultation.status}
        </Badge>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          fontSize: '0.92rem',
        }}
      >
        <div>
          <strong
            style={{
              display: 'block',
              color: 'var(--color-muted)',
              fontSize: '0.78rem',
            }}
          >
            Type
          </strong>
          {consultation.mode || '-'}
        </div>

        <div>
          <strong
            style={{
              display: 'block',
              color: 'var(--color-muted)',
              fontSize: '0.78rem',
            }}
          >
            Date & Time
          </strong>
          {formatDateTime(consultation.date)}
        </div>

        <div>
          <strong
            style={{
              display: 'block',
              color: 'var(--color-muted)',
              fontSize: '0.78rem',
            }}
          >
            Time Slot
          </strong>
          {consultation.timeSlot || '-'}
        </div>

        <div>
          <strong
            style={{
              display: 'block',
              color: 'var(--color-muted)',
              fontSize: '0.78rem',
            }}
          >
            Duration
          </strong>
          {consultation.duration || 0} min
        </div>

        <div>
          <strong
            style={{
              display: 'block',
              color: 'var(--color-muted)',
              fontSize: '0.78rem',
            }}
          >
            Rate Per Minute
          </strong>
          {formatCurrency(consultation.ratePerMinute || 0)}
        </div>

        <div>
          <strong
            style={{
              display: 'block',
              color: 'var(--color-muted)',
              fontSize: '0.78rem',
            }}
          >
            Total Amount
          </strong>
          {formatCurrency(consultation.totalFee || 0)}
        </div>

        <div>
          <strong
            style={{
              display: 'block',
              color: 'var(--color-muted)',
              fontSize: '0.78rem',
            }}
          >
            Payment Status
          </strong>
          {consultation.paymentStatus || '-'}
        </div>

        <div>
          <strong
            style={{
              display: 'block',
              color: 'var(--color-muted)',
              fontSize: '0.78rem',
            }}
          >
            Partner Earning
          </strong>
          {formatCurrency(consultation.partnerEarning || 0)}
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetails;