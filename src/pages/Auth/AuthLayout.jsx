import { Link } from 'react-router-dom';
import './Auth.css';

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="auth-screen">
    <div className="auth-panel">
      <Link to="/" className="auth-logo">✦ AstroNarhari <span>Partner</span></Link>
      <h1>{title}</h1>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      {children}
      {footer && <div className="auth-footer">{footer}</div>}
    </div>
    <div className="auth-aside">
      <blockquote>
        "Since joining, I spend more time reading charts and far less time
        chasing payments."
      </blockquote>
      <p>— Radhika Sharma, Vedic Astrologer</p>
    </div>
  </div>
);

export default AuthLayout;
