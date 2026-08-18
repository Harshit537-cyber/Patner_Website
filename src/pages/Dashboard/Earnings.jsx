import { useEffect, useState } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import EarningsChart from '../../components/dashboard/EarningsChart';
import { Wallet, Clock, TrendingUp } from 'lucide-react';
import Loader from '../../components/common/Loader';
import { getEarnings } from '../../services/earnings';
import { useDashboard } from '../../hooks/useDashboard';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const { data: dashboardData } = useDashboard();

  useEffect(() => {
    getEarnings().then(setEarnings);
  }, []);

  if (!earnings) return <Loader label="Loading earnings..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="dashboard-grid-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard icon={Wallet} label="Available balance" value={formatCurrency(earnings.available)} tone="gold" />
        <StatCard icon={Clock} label="Pending" value={formatCurrency(earnings.pending)} tone="primary" />
        <StatCard icon={TrendingUp} label="Lifetime earnings" value={formatCurrency(earnings.lifetime)} tone="success" />
      </div>

      {dashboardData && <EarningsChart data={dashboardData.earningsTrend} />}

      <div className="page-card">
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Payout history</h3>
        <table className="data-table">
          <thead>
            <tr><th>Description</th><th>Date</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {earnings.history.map((h, i) => (
              <tr key={i}>
                <td>{h.description}</td>
                <td>{formatDate(h.date)}</td>
                <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(h.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Earnings;
