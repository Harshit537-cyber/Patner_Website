import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CustomerDetails from '../../components/customers/CustomerDetails';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getCustomerById } from '../../services/customers';

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomerById(id).then((data) => {
      setCustomer(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader label="Loading customer..." />;
  if (!customer) return <EmptyState title="Customer not found" />;

  return (
    <div>
      <Link to="/dashboard/customers" style={{ display: 'inline-block', marginBottom: 16, color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.88rem' }}>
        ← Back to customers
      </Link>
      <CustomerDetails customer={customer} />
    </div>
  );
};

export default CustomerDetailsPage;
