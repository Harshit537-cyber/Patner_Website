import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import './Sections.css';

const plans = [
  {
    id: "chat",
    name: "Chat Consultation",
    badge: "STARTER TIER",
    rate: "₹8 – ₹25",
    unit: "per min",
    description: "Ideal for quick Q&A and handling high volume daily conversations.",
    features: [
      "Real-time instant messaging",
      "Automated chat summary",
      "Flexible schedule control",
      "Weekly direct bank payouts"
    ],
    highlight: false,
    buttonVariant: "primary"
  },
  {
    id: "voice",
    name: "Voice Consultation",
    badge: "MOST POPULAR",
    rate: "₹12 – ₹35",
    unit: "per min",
    description: "Highest conversion rate with deep personal client connection.",
    features: [
      "HD voice clarity audio calls",
      "In-app call recording access",
      "0% missed call penalty",
      "Priority customer discovery",
      "Weekly direct bank payouts"
    ],
    highlight: true,
    buttonVariant: "primary" // Changed from gold to primary to ensure visible UI button
  },
  {
    id: "video",
    name: "Video Consultation",
    badge: "PREMIUM TIER",
    rate: "₹18 – ₹45",
    unit: "per min",
    description: "For detailed Kundali reading, face-to-face remedies & guidance.",
    features: [
      "1-on-1 Ultra HD video stream",
      "Screen & chart sharing tools",
      "Higher payout per session",
      "VIP partner support 24/7"
    ],
    highlight: false,
    buttonVariant: "primary"
  }
];

const Earnings = () => {
  return (
    <section className="about-bento-section">
      {/* Background Ambient Glows */}
      <div className="bento-glow-orb orb-left" />
      <div className="bento-glow-orb orb-right" />

      <div className="container">
        
        {/* Top Header */}
        <div className="bento-top-bar">
          <motion.div 
            className="eyebrow-badge"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow-spark">✦</span>
            <span>Flexible Earning Tiers</span>
          </motion.div>

          <motion.h2 
            className="bento-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Choose Your Consultation Mode. <br />
            <span className="highlight-text">Set Rates. Multiply Earnings.</span>
          </motion.h2>

          <motion.p 
            className="bento-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Select how you want to connect with clients. Set your custom per-minute prices within guided tiers and keep 100% control of your income.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="bento-process-grid">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.id}
              className={`bento-block ${plan.highlight ? 'active' : ''}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div className="block-top-glow" />

              <div>
                {/* Header Badge */}
                <div className="block-header">
                  <span className="block-tag">{plan.badge}</span>
                </div>

                {/* Body Content */}
                <div className="block-body">
                  <h3>{plan.name}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
                    {plan.description}
                  </p>                  
                  
                  {/* Pricing Rate Box */}
                  <div className="bento-pricing-box" style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '6px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '20px'
                  }}>
                    <span className="bento-price-rate">{plan.rate}</span>
                    <span className="bento-price-unit">/ {plan.unit}</span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="bento-clean-feature-list" style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                        <span style={{
                          width: '18px',
                          height: '18px',
                          minWidth: '18px',
                          borderRadius: '50%',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Fixed Action Button */}
              <div className="bento-btn-container" style={{
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                width: '100%'
              }}>
                <Link to="/register" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                  <Button variant={plan.buttonVariant} fullWidth size="md">
                    Start Earning
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Earnings;