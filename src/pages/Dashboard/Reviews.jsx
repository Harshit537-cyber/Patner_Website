import { useEffect, useState } from 'react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getReviews } from '../../services/reviews';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader label="Loading reviews..." />;

  return (
    <div className="page-card">
      <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Customer reviews</h2>
      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Reviews from your consultations will appear here." />
      ) : (
        reviews.map((r) => (
          <div key={r.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: 'var(--color-heading)' }}>{r.customer}</strong>
              <span style={{ color: 'var(--color-accent-gold)' }}>{'★'.repeat(r.rating)}</span>
            </div>
            <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', margin: '6px 0 0' }}>{r.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;
