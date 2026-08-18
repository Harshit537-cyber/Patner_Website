import { Link } from 'react-router-dom';
import { ONBOARDING_STEPS } from '../../utils/constants';
import './Onboarding.css';

const OnboardingLayout = ({ activeKey, title, subtitle, children }) => {
  const activeIndex = ONBOARDING_STEPS.findIndex((s) => s.key === activeKey);

  return (
    <div className="onboarding-screen">
      <header className="onboarding-header">
        <Link to="/" className="onboarding-logo">✦ AstroNarhari <span>Partner</span></Link>
      </header>

      <div className="onboarding-progress">
        {ONBOARDING_STEPS.map((step, i) => (
          <div key={step.key} className={`onboarding-step ${i <= activeIndex ? 'onboarding-step-done' : ''} ${i === activeIndex ? 'onboarding-step-active' : ''}`}>
            <span className="onboarding-step-dot">{i < activeIndex ? '✓' : i + 1}</span>
            <span className="onboarding-step-label">{step.label}</span>
          </div>
        ))}
      </div>

      <main className="onboarding-body">
        <div className="onboarding-card">
          <h2>{title}</h2>
          {subtitle && <p className="onboarding-subtitle">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
