import React from 'react';
import { motion } from 'framer-motion';
import './Sections.css';

const AboutSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const featurePillars = [
    {
      badge: "VERIFICATION",
      title: "Fast-Track KYC Review",
      desc: "Get officially onboarded and verified within 24 hours with zero paperwork hassle."
    },
    {
      badge: "AUTONOMY",
      title: "Flexible Rate Control",
      desc: "Choose your own per-minute pricing and toggle availability whenever you want."
    },
    {
      badge: "SETTLEMENTS",
      title: "Direct Bank Payouts",
      desc: "Automated weekly deposits transferred straight to your account every single week."
    }
  ];

  return (
    <section className="about-editorial-section">
      {/* Subtle Background Glows */}
      <div className="editorial-glow orb-1" />
      <div className="editorial-glow orb-2" />

      <div className="container about-editorial-grid">
        
        {/* LEFT VISUAL STAGE */}
        <motion.div 
          className="about-left-stage"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.1}
          variants={fadeInUp}
        >
          {/* Sacred Geometric Background Rings */}
          <div className="editorial-astro-rings">
            <div className="ring-outer" />
            <div className="ring-inner" />
          </div>

          {/* Vertical Feature Pillars */}
          <div className="feature-matrix-wrapper">
            {featurePillars.map((item, idx) => (
              <motion.div 
                key={idx}
                className="matrix-pillar-card"
                custom={0.2 + idx * 0.1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="pillar-header">
                  <span className="pillar-sparkle">✦</span>
                  <span className="pillar-badge">{item.badge}</span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}

            {/* Floating Trust Badge */}
            <motion.div 
              className="editorial-trust-chip"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="chip-symbol">✨</span>
              <div className="chip-text">
                <strong>AstroNarhari Direct</strong>
                <small>100% Transparent Platform</small>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT EDITORIAL STORY */}
        <div className="about-right-body">
          <motion.div 
            className="eyebrow-badge"
            custom={0.1}
            initial="hidden"
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="eyebrow-spark">✦</span>
            <span className="eyebrow">About AstroNarhari</span>
          </motion.div>

          <motion.h2 
            className="editorial-heading"
            custom={0.2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Empowering Vedic experts with <span className="highlight-text">seamless practice management.</span>
          </motion.h2>

          <motion.p 
            className="editorial-subtext"
            custom={0.3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            We connect genuine astrologers with clients looking for trusted guidance over chat, call, or video. Effortlessly control your schedule, manage bookings, and focus entirely on reading charts while we handle the rest.
          </motion.p>

          <motion.div 
            className="editorial-quote-strip"
            custom={0.4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="quote-spark">✦</span>
            <blockquote>
              "Designed for practitioners who value authentic guidance over administrative hassle."
            </blockquote>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;