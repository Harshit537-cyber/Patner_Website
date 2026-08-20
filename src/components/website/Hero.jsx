import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  return (
    <section className="hero">
      <div className="container hero-inner">
        {/* LEFT COPY */}
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

        {/* RIGHT VISUAL - VEDIC ASTRO WHEEL */}
        <div className="hero-visual" aria-hidden="true">
          <motion.div
            className="astro-stage"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Background Glow */}
            <div className="glow-aura" />

            {/* Constellation Sparks */}
            <div className="star-field">
              <span className="star s1">✦</span>
              <span className="star s2">✧</span>
              <span className="star s3">✦</span>
            </div>

            {/* Outer Vedic Axis Ring */}
            <div className="ring ring-outer-vedic">
              <div className="vedic-axis axis-v" />
              <div className="vedic-axis axis-h" />
            </div>

            {/* Middle Orbit Ring */}
            <div className="ring ring-middle-orbit">
              <span className="orbit-node node-1" />
              <span className="orbit-node node-2" />
            </div>

            {/* Inner Sacred Geometry Ring */}
            <div className="ring ring-inner-geometry">
              <div className="astro-diamond" />
              <div className="astro-diamond alt" />
            </div>

            {/* Central Sun Core */}
            <div className="center-sun-core">
              <div className="sun-center-dot" />
              <div className="sun-wave" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
