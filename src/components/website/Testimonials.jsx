import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Astro Narhari has transformed how I manage my clients. The dashboard is smooth and payments land on time every Monday.",
    name: "Pandit Radhika Sharma",
    role: "Vedic Astrologer",
    location: "Jaipur",
    avatar: "RS",
    rating: 5,
    tag: "Verified Expert"
  },
  {
    quote: "The verification process was quick, and the support team helped me set up my consultation rates effortlessly.",
    name: "Aman Joshi",
    role: "Tarot & Numerologist",
    location: "Pune",
    avatar: "AJ",
    rating: 5,
    tag: "Top Rated"
  },
  {
    quote: "I love the flexibility to set my own consultation hours. Managing Kundali reports has never been easier.",
    name: "Dr. Meenal Rao",
    role: "Vastu & Palmistry",
    location: "Bengaluru",
    avatar: "MR",
    rating: 5,
    tag: "Verified Expert"
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      {/* Background Decorators */}
      <div className="t-glow-orb t-orb-left"></div>
      <div className="t-glow-orb t-orb-right"></div>

      <div className="container">
        {/* Section Header */}
        <div className="bento-top-bar">
          <div className="eyebrow-badge">
            <span className="eyebrow-spark">✦</span>
            <span>Astrologer Reviews</span>
          </div>
          <h2 className="bento-title">
            Trusted by Leading <span className="highlight-text">Astrologers</span>
          </h2>
          <p className="bento-subtitle">
            See how top experts are scaling their consultations with Astro Narhari.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="testimonials-grid">
          {testimonials.map((item, idx) => (
            <motion.div 
              className="testimonial-card" 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
            >
              <div className="card-top">
                <span className="t-badge">{item.tag}</span>
                <div className="t-stars">
                  {"★".repeat(item.rating)}
                </div>
              </div>

              <div className="card-body">
                <span className="quote-icon">“</span>
                <p className="t-text">{item.quote}</p>
              </div>

              <div className="t-author">
                <div className="t-avatar-wrapper">
                  <div className="t-avatar">{item.avatar}</div>
                  <span className="verified-tick">✓</span>
                </div>
                <div className="t-info">
                  <h4>{item.name}</h4>
                  <p>{item.role} • <span className="location">{item.location}</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;