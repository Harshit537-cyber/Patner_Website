import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';
import './Sections.css';

const contactSteps = [
  {
    icon: "✉",
    label: "Email Support",
    val: "partners@astronarhari.com",
    href: "mailto:partners@astronarhari.com"
  },
  {
    icon: "📞",
    label: "Direct Phone",
    val: "+91 98765 43210",
    href: "tel:+919876543210"
  },
  {
    icon: "🕒",
    label: "Partner Desk Hours",
    val: "Mon – Sat, 10:00 AM – 7:00 PM IST",
    href: null
  }
];

const ContactSection = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="about-bento-section contact-bento-override">
      {/* Dynamic Background Ambient Glow Orbs */}
      <motion.div 
        className="bento-glow-orb orb-left"
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="bento-glow-orb orb-right"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container contact-bento-container">
        
        {/* LEFT COLUMN: Premium Contact Info Card */}
        <motion.div 
          className="bento-block contact-info-bento"
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="block-top-glow" />

          <div>
            <div className="eyebrow-badge">
              <span className="eyebrow-spark">✦</span>
              <span>Get In Touch</span>
            </div>

            <h2 className="bento-title contact-heading">
              Have a question before <br />
              <span className="highlight-text">you apply?</span>
            </h2>

            <p className="bento-subtitle contact-sub">
              Our partner success team is here to walk you through the onboarding process, payouts, or schedule controls.
            </p>
          </div>

          {/* Contact Methods List */}
          {/* Contact Methods List */}
<div className="contact-details-list">
  {contactSteps.map((item, idx) => (
    <motion.div 
      className="contact-detail-row" 
      key={idx}
      whileHover={{ x: 6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="arrow-circle icon-circle">
        <span className="icon-symbol">{item.icon}</span>
      </div>
      <div className="detail-meta">
        <span className="detail-label">{item.label}</span>
        {item.href ? (
          <a href={item.href} className="detail-value">{item.val}</a>
        ) : (
          <span className="detail-value">{item.val}</span>
        )}
      </div>
    </motion.div>
  ))}
</div>

          {/* Social Proof Live Pill */}
          <div className="contact-trust-pill">
            <span className="live-pulse-dot"></span>
            <span>Fast Response Guarantee • Usually replies in &lt; 2 hours</span>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Modern Form Container */}
        <motion.div 
          className="bento-block contact-form-bento active"
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <div className="block-top-glow" />

          {sent ? (
            <motion.div 
              className="contact-success-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="arrow-circle success-circle">
                <span>✓</span>
              </div>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out — our partner team will get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h3 className="form-title">Send us a message</h3>
                <span className="form-subtitle">Fill in the form below and we'll connect right away.</span>
              </div>
              
              <div className="form-inputs-wrapper">
                <div className="form-group">
                  <Input label="Full name" placeholder="e.g. Pt. Rajesh Sharma" required />
                </div>

                <div className="form-group">
                  <Input label="Email address" type="email" placeholder="you@example.com" required />
                </div>

                <div className="form-group">
                  <Input label="Message" placeholder="Ask us anything about joining AstroNarhari..." required />
                </div>
              </div>

              <motion.div 
                className="form-submit-btn-wrap"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button type="submit" fullWidth>
                  Send Message ✦
                </Button>
              </motion.div>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection;