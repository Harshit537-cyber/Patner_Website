import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import './Onboarding.css';

const statusConfig = {
  pending: {
    icon: '⏳',
    tone: 'status-icon-pending',
    title: 'Your application is under review',
    desc: 'Our team typically reviews applications within 2–3 working days. We will notify you by SMS and email once a decision is made.',
  },
  approved: {
    icon: '✓',
    tone: 'status-icon-approved',
    title: "You're approved!",
    desc: 'Welcome to AstroNarhari. Head to your dashboard to set your availability and start taking consultations.',
  },
  rejected: {
    icon: '!',
    tone: 'status-icon-rejected',
    title: 'More information needed',
    desc: 'A few details in your KYC need correction. Please review and re-submit to continue.',
  },
};

const ApplicationStatus = ({ status = 'pending' }) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="onboarding-screen">
      <header className="onboarding-header">
        <Link to="/" className="onboarding-logo">✦ AstroNarhari <span>Partner</span></Link>
      </header>
      <main className="onboarding-body">
        <div className="onboarding-card status-hero">
          <div className={`status-icon ${config.tone}`}>{config.icon}</div>
          <h2>{config.title}</h2>
          <p className="onboarding-subtitle">{config.desc}</p>
          {status === 'approved' && (
            <Link to="/dashboard"><Button>Go to dashboard</Button></Link>
          )}
          {status === 'rejected' && (
            <Link to="/onboarding/kyc"><Button>Re-submit KYC</Button></Link>
          )}
          {status === 'pending' && (
            <Link to="/"><Button variant="outline">Back to homepage</Button></Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplicationStatus;
