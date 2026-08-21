import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import "./Hero.css";

const Hero = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const conversationFlow = [
    { sender: "user", text: "Namaste Acharya ji! Meri job switch ki kab tak yog ban rahe hain?" },
    { sender: "astrologer", text: "Namaste! Aapke 10th house me Jupiter ki position strong hai, August ke baad naye chances milenge." },
    { sender: "user", text: "Kya mujhe dusre city relocate karna chahiye?" },
    { sender: "astrologer", text: "Haan ji, foreign ya long distance connections kafi favorable hain. Confident rahiye!" },
    { sender: "user", text: "Thank you so much! Kuch remedy batayein please." },
    { sender: "astrologer", text: "Roz subah Surya ko jal dijiye aur kesar ka tilak lagayein. Sab accha hoga." },
    { sender: "user", text: "Kundali me shani ki mahadasha kab khatam hogi?" },
    { sender: "astrologer", text: "Shani ki dhaiyya abhi last phase me hai, Hanuman Chalisa ka path regular karein." }
  ];

  const [visibleCount, setVisibleCount] = useState(3);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timer;
    if (visibleCount < conversationFlow.length) {
      setIsTyping(true);
      timer = setTimeout(() => {
        setIsTyping(false);
        setVisibleCount((prev) => prev + 1);
      }, 2200);
    } else {
      timer = setTimeout(() => {
        setVisibleCount(3);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <motion.div
            className="eyebrow-badge"
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="eyebrow-spark">✦</span>
            <span className="eyebrow">For practicing astrologers</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Your practice, held together in{" "}
            <span className="highlight-text">one calm dashboard.</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Take consultations from clients across the country, manage your
            calendar on your own terms, and get paid out weekly — without
            running a business on the side.
          </motion.p>

          <motion.div
            className="hero-cta"
            custom={0.4}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Link to="/register">
              <Button size="lg">Become a Partner</Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="hero-stats-row"
            custom={0.5}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="stat-item">
              <strong className="stat-number">12,000+</strong>
              <span className="stat-label">Consultations / mo</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <strong className="stat-number">₹38L+</strong>
              <span className="stat-label">Paid out weekly</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <strong className="stat-number">4.8/5</strong>
              <span className="stat-label">Average partner rating</span>
            </div>
          </motion.div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <motion.div
            className="astro-stage"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="glow-aura" />

            <div className="star-field">
              <span className="star s1">✦</span>
              <span className="star s2">✧</span>
              <span className="star s3">✦</span>
            </div>

            <div className="phone-device">
              <div className="phone-speaker" />
              <div className="phone-screen">
                <div className="phone-status-bar">
                  <span>9:41</span>
                  <div className="status-icons">
                    <span className="signal-dot" />
                    <span className="signal-dot" />
                    <span className="signal-dot" />
                  </div>
                </div>

                <div className="chat-header">
                  <div className="astrologer-avatar-container">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" 
                      alt="Acharya Shruti" 
                      className="astrologer-img"
                    />
                    <span className="online-indicator" />
                  </div>
                  <div className="astrologer-meta">
                    <h4>Acharya Shruti</h4>
                    <p>Vedic & Tarot Expert</p>
                  </div>
                  <div className="live-badge">LIVE</div>
                </div>

                <div className="chat-messages-container">
                  <AnimatePresence mode="popLayout">
                    {conversationFlow.slice(0, visibleCount).map((msg, index) => {
                      const isLatest = index === visibleCount - 1;
                      return (
                        <motion.div
                          key={index}
                          className={`chat-bubble-row ${msg.sender}`}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: 25 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                          transition={{ 
                            type: "spring",
                            stiffness: 350,
                            damping: 25
                          }}
                        >
                          {msg.sender === "astrologer" && (
                            <div className="bubble-avatar">✦</div>
                          )}
                          <div className={`chat-bubble ${msg.sender}`}>
                            <p>{msg.text}</p>
                          </div>
                        </motion.div>
                      );
                    })}

                    {isTyping && (
                      <motion.div
                        key="typing"
                        className="typing-indicator-row"
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      >
                        <div className="bubble-avatar">✦</div>
                        <div className="typing-bubble">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="phone-input-bar">
                  <div className="fake-input-text">Type your query...</div>
                  <div className="send-icon-btn">✦</div>
                </div>
              </div>
            </div>

            <motion.div 
              className="floating-widget-card"
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="widget-icon">✦</div>
              <div className="widget-content">
                <span className="widget-title">New Consultation</span>
                <span className="widget-subtitle">Completed • ₹600 credited</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;