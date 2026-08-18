import { Link } from 'react-router-dom';
import { WEBSITE_NAV } from '../../utils/constants';
import { ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    {/* Ambient Glow Orbs like Bento Section */}
    <div className="footer-glow-orb orb-left" />
    <div className="footer-glow-orb orb-right" />

    {/* Top Glow Border Accent */}
    <div className="footer-top-glow" />

    <div className="container footer-inner">
      {/* Brand Column */}
      <div className="footer-brand">
        <Link to="/" className="footer-logo">
          ✦ AstroNarhari <span className="partner-badge">PARTNER</span>
        </Link>
        <p className="footer-tagline">
          A calmer, smarter way to build your astrology practice — consultations, schedule, and payouts, handled seamlessly for you.
        </p>

        <div className="footer-trust-badge">
          <ShieldCheck size={16} className="trust-icon" />
          <span>Verified & Secure Platform</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="footer-col">
        <h5>Explore</h5>
        {WEBSITE_NAV.map((item) => (
          <Link key={item.path} to={item.path} className="footer-link">
            <span>{item.label}</span>
            <ArrowUpRight size={14} className="link-arrow" />
          </Link>
        ))}
      </div>

      {/* Partner Links */}
      <div className="footer-col">
        <h5>Partner Hub</h5>
        <Link to="/register" className="footer-link highlighted-link">
          <span>Become a Partner</span>
          <ArrowUpRight size={14} className="link-arrow" />
        </Link>
        <Link to="/login" className="footer-link">
          <span>Partner Login</span>
          <ArrowUpRight size={14} className="link-arrow" />
        </Link>
        <Link to="/faq" className="footer-link">
          <span>Support & FAQs</span>
          <ArrowUpRight size={14} className="link-arrow" />
        </Link>
      </div>

      {/* Legal Links */}
      <div className="footer-col">
        <h5>Legal & Policy</h5>
        <Link to="/faq" className="footer-link">
          <span>Terms of Service</span>
        </Link>
        <Link to="/faq" className="footer-link">
          <span>Privacy Policy</span>
        </Link>
        <Link to="/faq" className="footer-link">
          <span>Partner Agreement</span>
        </Link>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="footer-bottom">
      <div className="container footer-bottom-inner">
        <p>© {new Date().getFullYear()} AstroNarhari. All rights reserved.</p>
        <p className="footer-crafted">
          Crafted with <Heart size={13} className="heart-icon" /> for Spiritual Practitioners
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;