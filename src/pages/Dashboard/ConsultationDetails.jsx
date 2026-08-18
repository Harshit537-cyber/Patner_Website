import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ConsultationDetails from '../../components/consultations/ConsultationDetails';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getConsultationById } from '../../services/consultations';

const ConsultationDetailsPage = () => {
  const { id } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConsultationById(id).then((data) => {
      setConsultation(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader label="Loading consultation..." />;
  if (!consultation) return <EmptyState title="Consultation not found" description="It may have been removed." />;

  return (
    <div>
      <Link to="/dashboard/consultations" style={{ display: 'inline-block', marginBottom: 16, color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.88rem' }}>
        ← Back to consultations
      </Link>
      <ConsultationDetails consultation={consultation} />
    </div>
  );
};

export default ConsultationDetailsPage;
