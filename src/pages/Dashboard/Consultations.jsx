import { useEffect, useState } from 'react';
import ConsultationTable from '../../components/consultations/ConsultationTable';
import ConsultationFilters from '../../components/consultations/ConsultationFilters';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import { getPartnerRequests } from '../../services/partner';

const Consultations = () => {
  const [all, setAll] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log('Fetching partner booking requests...');

        const response = await getPartnerRequests();

        console.log(
          'PARTNER BOOKING REQUESTS RESPONSE:',
          JSON.stringify(response, null, 2)
        );

        const requests = response?.data ?? [];

        setAll(Array.isArray(requests) ? requests : []);
      } catch (error) {
        console.error('Partner Booking Requests Error:', error);
        setAll([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filtered =
    filter === 'all'
      ? all
      : all.filter((c) => c.status === filter);

  if (loading) {
    return <Loader label="Loading consultations..." />;
  }

  return (
    <div className="page-card">
      <div className="page-toolbar">
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
          All consultations
        </h2>

        <ConsultationFilters
          active={filter}
          onChange={setFilter}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No consultations here"
          description="Consultations matching this filter will show up here."
        />
      ) : (
        <ConsultationTable consultations={filtered} />
      )}
    </div>
  );
};

export default Consultations;