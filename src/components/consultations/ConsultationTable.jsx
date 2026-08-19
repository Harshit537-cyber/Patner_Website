import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatDateTime, formatCurrency } from '../../utils/formatters';

const statusTone = {
  pending: 'neutral',
  accepted: 'success',
  rejected: 'error',
};

const ConsultationTable = ({ consultations = [] }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Type</th>
          <th>Date & Time</th>
          <th>Duration</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {consultations.map((booking) => (
          <tr key={booking._id}>
            <td>
              <Link
                to={`/dashboard/consultations/${booking._id}`}
                style={{
                  fontWeight: 600,
                  color: 'var(--color-heading)',
                }}
              >
                {booking.user?.name || 'Unknown'}
              </Link>
            </td>

            <td>
              {booking.mode || '-'}
            </td>

            <td>
              {formatDateTime(booking.date)}
            </td>

            <td>
              {booking.duration} min
            </td>

            <td>
              {formatCurrency(booking.totalFee || 0)}
            </td>

            <td>
              <Badge tone={statusTone[booking.status] || 'neutral'}>
                {booking.status}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConsultationTable;