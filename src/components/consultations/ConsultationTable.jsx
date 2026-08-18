import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatDateTime, formatCurrency } from '../../utils/formatters';

const statusTone = { upcoming: 'neutral', completed: 'success', cancelled: 'error' };

const ConsultationTable = ({ consultations = [] }) => (
  <table className="data-table">
    <thead>
      <tr>
        <th>Customer</th>
        <th>Type</th>
        <th>Date & time</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {consultations.map((c) => (
        <tr key={c.id}>
          <td>
            <Link to={`/dashboard/consultations/${c.id}`} style={{ fontWeight: 600, color: 'var(--color-heading)' }}>
              {c.customer}
            </Link>
          </td>
          <td>{c.type}</td>
          <td>{formatDateTime(c.date)}</td>
          <td>{formatCurrency(c.amount)}</td>
          <td><Badge tone={statusTone[c.status] || 'neutral'}>{c.status}</Badge></td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ConsultationTable;
