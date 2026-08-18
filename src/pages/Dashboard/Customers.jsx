import { useEffect, useState } from 'react';
import CustomerTable from '../../components/customers/CustomerTable';
import Loader from '../../components/common/Loader';
import { getCustomers } from '../../services/customers';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader label="Loading customers..." />;

  return (
    <div className="page-card">
      <div className="page-toolbar">
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Your customers</h2>
      </div>
      <CustomerTable customers={customers} />
    </div>
  );
};

export default Customers;
