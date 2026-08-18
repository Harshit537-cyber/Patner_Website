import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Sections.css';

const faqs = [
  { 
    num: "01",
    q: 'Who can become a partner?', 
    a: 'Any practicing astrologer, tarot reader, numerologist or Vastu consultant with at least one year of client experience can apply.' 
  },
  { 
    num: "02",
    q: 'How long does approval take?', 
    a: 'Most applications are reviewed within 2–3 working days after all documents and KYC are submitted.' 
  },
  { 
    num: "03",
    q: 'How do I get paid?', 
    a: 'Earnings are settled weekly to the bank account you add during onboarding, minus the platform fee.' 
  },
  { 
    num: "04",
    q: 'Can I set my own consultation rates?', 
    a: 'Yes — you choose rates within the guided range for chat, call and video consultations, and can update them anytime.' 
  },
  { 
    num: "05",
    q: 'What if my application is rejected?', 
    a: 'You will see the reason on your application status page and can re-submit your KYC once corrected.' 
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="about-bento-section faq-bento-override">
      {/* Background Ambient Glow Orbs */}
      <motion.div 
        className="bento-glow-orb orb-left"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="bento-glow-orb orb-right"
        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container">
        {/* Header Section Matching Bento Design */}
        <div className="bento-top-bar">
          <motion.div 
            className="eyebrow-badge"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow-spark">✦</span>
            <span>Got Questions?</span>
          </motion.div>

          <motion.h2 
            className="bento-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Frequently Asked <span className="highlight-text">Questions</span>
          </motion.h2>

          <motion.p 
            className="bento-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything you need to know about joining, onboarding, rates, and payouts.
          </motion.p>
        </div>

        {/* Accordion Container */}
        <div className="faq-bento-list">
          {faqs.map((f, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div 
                key={f.num}
                className={`bento-block faq-bento-card ${isOpen ? 'active' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => toggleFAQ(index)}
              >
                <div className="block-top-glow" />

                <div className="faq-card-header">
                  <div className="faq-question-wrap">
                    <span className="block-num">{f.num}</span>
                    <h3 className="faq-question-text">{f.q}</h3>
                  </div>

                  <motion.div 
                    className="arrow-circle"
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <svg 
                      className="block-arrow" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </motion.div>
                </div>

                {/* Animated Expandable Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-wrap"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <p className="faq-answer-text">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;