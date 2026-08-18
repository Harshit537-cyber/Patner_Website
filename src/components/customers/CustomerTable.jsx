import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const CustomerTable = ({ customers = [] }) => (
  <table className="data-table">
    <thead>
      <tr>
        <th>Customer</th>
        <th>Consultations</th>
        <th>Last visit</th>
        <th>Rating</th>
      </tr>
    </thead>
    <tbody>
      {customers.map((c) => (
        <tr key={c.id}>
          <td>
            <Link to={`/dashboard/customers/${c.id}`} style={{ fontWeight: 600, color: 'var(--color-heading)' }}>
              {c.name}
            </Link>
          </td>
          <td>{c.consultations}</td>
          <td>{formatDate(c.lastVisit)}</td>
          <td>★ {c.rating}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CustomerTable;
