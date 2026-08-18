import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import './Sections.css';

const plans = [
  {
    name: "Chat Consultation",
    badge: "STARTER TIER",
    rate: "₹8 – ₹25",
    unit: "per minute",
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
    name: "Voice Consultation",
    badge: "MOST POPULAR",
    rate: "₹12 – ₹35",
    unit: "per minute",
    description: "Highest conversion rate with deep personal client connection.",
    features: [
      "HD voice clarity audio calls",
      "In-app call recording access",
      "0% missed call penalty",
      "Priority customer discovery",
      "Weekly direct bank payouts"
    ],
    highlight: true,
    buttonVariant: "gold"
  },
  {
    name: "Video Consultation",
    badge: "PREMIUM TIER",
    rate: "₹18 – ₹45",
    unit: "per minute",
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
      {/* Background Glows */}
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

        {/* Bento 3-Column Pricing Grid */}
        <div className="bento-process-grid">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              className={`bento-block ${plan.highlight ? 'active' : ''}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="block-top-glow" />

              <div className="block-header">
                <span className="block-tag">{plan.badge}</span>
              </div>

              <div className="block-body">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                
                <div className="bento-pricing-box">
                  <span className="bento-price-rate">{plan.rate}</span>
                  <span className="bento-price-unit">/ {plan.unit}</span>
                </div>

                <ul className="bento-clean-feature-list">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div className="bento-btn-container">
                <Link to="/register" style={{ textDecoration: 'none', width: '100%' }}>
                  <Button variant={plan.buttonVariant} fullWidth size="md">
                    Start Earning
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div 
          className="bento-quote-banner"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="quote-banner-inner">
            <div className="banner-badge">
              <span className="live-pulse-dot"></span>
              <span>100% AUTOMATED PAYOUTS</span>
            </div>
            <p className="banner-quote-text">
              Direct Weekly Bank Transfers Every Monday Morning.
            </p>
            <div className="banner-footer-row">
              <span className="banner-brand">AstroNarhari Partner Network</span>
              <span className="payout-status">0% Hidden Charges</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Earnings;