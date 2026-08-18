import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import './Onboarding.css';

const RegistrationSuccess = () => (
  <div className="onboarding-screen">
    <header className="onboarding-header">
      <Link to="/" className="onboarding-logo">✦ AstroNarhari <span>Partner</span></Link>
    </header>
    <main className="onboarding-body">
      <div className="onboarding-card status-hero">
        <div className="status-icon status-icon-approved">✓</div>
        <h2>Application submitted</h2>
        <p className="onboarding-subtitle">
          Thanks for applying to AstroNarhari. We've received your details and
          our team will review your application within 2–3 working days.
        </p>
        <Link to="/onboarding/application-status"><Button>Check application status</Button></Link>
      </div>
    </main>
  </div>
);

export default RegistrationSuccess;
