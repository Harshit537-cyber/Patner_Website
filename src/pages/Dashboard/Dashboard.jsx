import { useEffect, useState } from 'react';
import { Wallet, MessageCircle, Users, Star } from 'lucide-react';

import StatCard from '../../components/dashboard/StatCard';
import EarningsChart from '../../components/dashboard/EarningsChart';
import ConsultationChart from '../../components/dashboard/ConsultationChart';
import UpcomingConsultations from '../../components/dashboard/UpcomingConsultations';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import QuickActions from '../../components/dashboard/QuickActions';
import Loader from '../../components/common/Loader';

import { useDashboard } from '../../hooks/useDashboard';
import { formatCurrency } from '../../utils/formatters';

import {
  getDutyStatus,
  setDutyOn,
  setDutyOff,
} from '../../services/partner';

const Dashboard = () => {
  const { data, loading } = useDashboard();

  const [dutyOn, setDutyOnState] = useState(false);
  const [dutyLoading, setDutyLoading] = useState(true);
  const [dutyUpdating, setDutyUpdating] = useState(false);

  // ==========================================
  // FETCH DUTY STATUS
  // ==========================================
  useEffect(() => {
    const fetchDutyStatus = async () => {
      try {
        console.log('Fetching duty status...');

        const response = await getDutyStatus();

        console.log(
          'FULL DUTY STATUS RESPONSE:',
          JSON.stringify(response, null, 2)
        );

        const isOn =
          response?.dutyOn ??
          response?.isOnDuty ??
          response?.onDuty ??
          response?.duty_status ??
          response?.data?.dutyOn ??
          response?.data?.isOnDuty ??
          response?.data?.onDuty ??
          response?.data?.duty_status ??
          response?.status === 'on';

        setDutyOnState(Boolean(isOn));
      } catch (error) {
        console.error('Duty Status Error:', error);
      } finally {
        setDutyLoading(false);
      }
    };

    fetchDutyStatus();
  }, []);

  // ==========================================
  // DUTY ON
  // ==========================================
  const handleDutyOn = async () => {
    if (dutyOn || dutyUpdating || dutyLoading) return;

    try {
      setDutyUpdating(true);

      console.log('Turning duty ON...');

      const response = await setDutyOn();

      console.log(
        'FULL DUTY ON RESPONSE:',
        JSON.stringify(response, null, 2)
      );

      const isOn =
        response?.dutyOn ??
        response?.isOnDuty ??
        response?.onDuty ??
        response?.duty_status ??
        response?.data?.dutyOn ??
        response?.data?.isOnDuty ??
        response?.data?.onDuty ??
        response?.data?.duty_status ??
        response?.status === 'on';

      // Backend ne success diya hai to ON maanenge
      setDutyOnState(
        response ? Boolean(isOn || response?.success) : false
      );
    } catch (error) {
      console.error('Duty ON Error:', error);
    } finally {
      setDutyUpdating(false);
    }
  };

  // ==========================================
  // DUTY OFF
  // ==========================================
  const handleDutyOff = async () => {
    if (!dutyOn || dutyUpdating || dutyLoading) return;

    try {
      setDutyUpdating(true);

      console.log('Turning duty OFF...');

      const response = await setDutyOff();

      console.log(
        'FULL DUTY OFF RESPONSE:',
        JSON.stringify(response, null, 2)
      );

      // OFF API successful hai to directly OFF
      setDutyOnState(false);
    } catch (error) {
      console.error('Duty OFF Error:', error);
    } finally {
      setDutyUpdating(false);
    }
  };

  if (loading || !data) {
    return <Loader label="Loading your dashboard..." />;
  }

  return (
    <div>
      {/* ==========================================
          DUTY STATUS
      ========================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          padding: '16px 20px',
          borderRadius: 12,
          background: '#fff',
          border: '1px solid #e5e1ec',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              color: '#777',
              marginBottom: 4,
            }}
          >
            Duty Status
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {dutyLoading
              ? 'Checking...'
              : dutyOn
              ? 'You are ON duty'
              : 'You are OFF duty'}
          </div>
        </div>

        <button
          type="button"
          onClick={dutyOn ? handleDutyOff : handleDutyOn}
          disabled={dutyUpdating || dutyLoading}
          style={{
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            cursor:
              dutyUpdating || dutyLoading
                ? 'not-allowed'
                : 'pointer',
            opacity:
              dutyUpdating || dutyLoading
                ? 0.6
                : 1,
            background: dutyOn ? '#d32f2f' : '#7042a5',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {dutyUpdating
            ? 'Updating...'
            : dutyOn
            ? 'Turn Duty OFF'
            : 'Turn Duty ON'}
        </button>
      </div>

      {/* ==========================================
          STATS
      ========================================== */}
      <div className="dashboard-grid-stats">
        <StatCard
          icon={Wallet}
          label="Total earnings"
          value={formatCurrency(data.totalEarnings)}
          delta="+12% vs last month"
          tone="gold"
        />

        <StatCard
          icon={MessageCircle}
          label="Consultations this month"
          value={data.consultationsThisMonth}
          delta="+8 this week"
          tone="primary"
        />

        <StatCard
          icon={Users}
          label="Active customers"
          value={data.activeCustomers}
          tone="primary"
        />

        <StatCard
          icon={Star}
          label="Average rating"
          value={`${data.avgRating} / 5`}
          tone="success"
        />
      </div>

      {/* ==========================================
          CHARTS
      ========================================== */}
      <div className="dashboard-grid-charts">
        <EarningsChart data={data.earningsTrend} />
        <ConsultationChart data={data.consultationTrend} />
      </div>

      {/* ==========================================
          WIDGETS
      ========================================== */}
      <div className="dashboard-grid-widgets">
        <UpcomingConsultations
          items={[
            {
              id: 'C-1042',
              customer: 'Priya Nair',
              type: 'Video',
              date: '2026-08-13T10:30:00',
            },
            {
              id: 'C-1043',
              customer: 'Arjun Verma',
              type: 'Chat',
              date: '2026-08-13T15:00:00',
            },
          ]}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <QuickActions />

          <RecentTransactions
            items={[
              {
                description: 'Weekly payout',
                date: '2026-08-05',
                amount: 14200,
              },
              {
                description: 'Weekly payout',
                date: '2026-07-29',
                amount: 12800,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;