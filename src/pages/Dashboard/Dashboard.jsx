import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  MessageCircle,
  Users,
  Star,
  Wifi,
  Activity,
} from 'lucide-react';

import StatCard from '../../components/dashboard/StatCard';
import EarningsChart from '../../components/dashboard/EarningsChart';
import ConsultationChart from '../../components/dashboard/ConsultationChart';
import UpcomingConsultations from '../../components/dashboard/UpcomingConsultations';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import QuickActions from '../../components/dashboard/QuickActions';

import { useDashboard } from '../../hooks/useDashboard';
import { formatCurrency } from '../../utils/formatters';

import {
  getDutyStatus,
  setDutyOn,
  setDutyOff,
} from '../../services/partner';

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Dashboard = () => {
  const { data, loading } = useDashboard();

  const [dutyOn, setDutyOnState] = useState(false);
  const [dutyLoading, setDutyLoading] = useState(true);
  const [dutyUpdating, setDutyUpdating] = useState(false);

  useEffect(() => {
    const fetchDutyStatus = async () => {
      try {
        const response = await getDutyStatus();
        const result = response?.data ?? response;

        setDutyOnState(Boolean(result?.isOnline));
      } catch (error) {
        console.error('Duty Status Error:', error);
      } finally {
        setDutyLoading(false);
      }
    };

    fetchDutyStatus();
  }, []);

  const handleDutyOn = async () => {
    if (dutyOn || dutyUpdating || dutyLoading) return;

    try {
      setDutyUpdating(true);

      const response = await setDutyOn();
      const result = response?.data ?? response;

      if (result?.isOnline === true || result?.success === true) {
        setDutyOnState(true);
      }
    } catch (error) {
      console.error('Duty ON Error:', error);
    } finally {
      setDutyUpdating(false);
    }
  };

  const handleDutyOff = async () => {
    if (!dutyOn || dutyUpdating || dutyLoading) return;

    try {
      setDutyUpdating(true);

      const response = await setDutyOff();
      const result = response?.data ?? response;

      if (result?.isOnline === false || result?.success === true) {
        setDutyOnState(false);
      }
    } catch (error) {
      console.error('Duty OFF Error:', error);
    } finally {
      setDutyUpdating(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loader">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="dashboard-loader-ring"
          />

          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="dashboard-loader-dot"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      className="dashboard-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className={`duty-status-card ${dutyOn ? 'is-online' : 'is-offline'}`}
      >
        <div className="duty-background-glow duty-glow-one" />
        <div className="duty-background-glow duty-glow-two" />

        <motion.div
          className="duty-light-line"
          animate={{
            x: ['-120%', '320%'],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="duty-floating-dot duty-floating-dot-one"
          animate={{
            y: [0, -14, 0],
            x: [0, 8, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="duty-floating-dot duty-floating-dot-two"
          animate={{
            y: [0, 12, 0],
            x: [0, -8, 0],
            opacity: [0.15, 0.6, 0.15],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />

        <div className="duty-status-content">
          <div className="duty-title-row">
            <motion.div
              animate={{
                rotate: dutyOn ? [0, 8, -8, 0] : 0,
              }}
              transition={{
                duration: 2,
                repeat: dutyOn ? Infinity : 0,
                ease: 'easeInOut',
              }}
              className="duty-icon-box"
            >
              <Activity size={18} />
            </motion.div>

            <div>
              <div className="duty-label">Duty Status</div>

              <div className="duty-subtitle">
                {dutyOn
                  ? 'You are available for consultations'
                  : 'You are currently unavailable'}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={
                dutyLoading
                  ? 'loading'
                  : dutyOn
                  ? 'online'
                  : 'offline'
              }
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.3,
              }}
              className={`duty-status-pill ${
                dutyOn ? 'online' : 'offline'
              }`}
            >
              <span className="duty-indicator">
                <motion.span
                  className="duty-indicator-wave"
                  animate={
                    dutyLoading || dutyOn
                      ? {
                          scale: [1, 2.2, 1],
                          opacity: [0.6, 0, 0.6],
                        }
                      : {
                          scale: 1,
                          opacity: 0,
                        }
                  }
                  transition={{
                    duration: 1.6,
                    repeat: dutyLoading || dutyOn ? Infinity : 0,
                    ease: 'easeOut',
                  }}
                />

                <motion.span
                  className="duty-indicator-core"
                  animate={
                    dutyLoading || dutyOn
                      ? {
                          scale: [1, 1.12, 1],
                        }
                      : {
                          scale: 1,
                        }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: dutyLoading || dutyOn ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                />
              </span>

              <span>
                {dutyLoading
                  ? 'Checking status...'
                  : dutyOn
                  ? 'You are Online'
                  : 'You are Offline'}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={dutyOn ? handleDutyOff : handleDutyOn}
          disabled={dutyUpdating || dutyLoading}
          whileHover={
            dutyUpdating || dutyLoading
              ? {}
              : {
                  scale: 1.04,
                  y: -2,
                }
          }
          whileTap={
            dutyUpdating || dutyLoading
              ? {}
              : {
                  scale: 0.96,
                }
          }
          className={`duty-action-button ${
            dutyOn ? 'go-offline' : 'go-online'
          }`}
        >
          <motion.span
            className="duty-button-shine"
            animate={{
              x: ['-150%', '250%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <span className="duty-button-content">
            {dutyUpdating
              ? 'Updating...'
              : dutyOn
              ? 'Go Offline'
              : 'Go Online'}
          </span>
        </motion.button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="dashboard-grid-stats"
      >
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
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="dashboard-grid-charts"
      >
        <motion.div
          whileHover={{
            y: -5,
          }}
          transition={{
            duration: 0.25,
          }}
        >
          <EarningsChart data={data.earningsTrend} />
        </motion.div>

        <motion.div
          whileHover={{
            y: -5,
          }}
          transition={{
            duration: 0.25,
          }}
        >
          <ConsultationChart data={data.consultationTrend} />
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="dashboard-grid-widgets"
      >
        <motion.div
          whileHover={{
            y: -4,
          }}
          transition={{
            duration: 0.25,
          }}
        >
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
        </motion.div>

        <div className="dashboard-side-widgets">
          <motion.div
            whileHover={{
              y: -4,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <QuickActions />
          </motion.div>

          <motion.div
            whileHover={{
              y: -4,
            }}
            transition={{
              duration: 0.25,
            }}
          >
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
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;