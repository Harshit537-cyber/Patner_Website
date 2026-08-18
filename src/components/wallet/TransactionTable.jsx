import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';

const TransactionTable = ({ transactions = [] }) => (
  <table className="data-table">
    <thead>
      <tr><th>Description</th><th>Date</th><th>Amount</th><th>Status</th></tr>
    </thead>
    <tbody>
      {transactions.map((t, i) => (
        <tr key={i}>
          <td>{t.description}</td>
          <td>{formatDate(t.date)}</td>
          <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(t.amount)}</td>
          <td><Badge tone={t.status === 'processing' ? 'warning' : 'success'}>{t.status || 'completed'}</Badge></td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TransactionTable;
