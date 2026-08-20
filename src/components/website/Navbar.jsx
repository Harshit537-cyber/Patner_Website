import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "../common/Button";
import "./Navbar.css";

// ONLY HOME, ABOUT, CONTACT, EARNINGS, FAQ LINKS
const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Earnings", path: "/earnings" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* LOGO */}
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <span className="navbar-logo-mark">✦</span> AstroNarhari
          <span className="navbar-logo-sub">Partner</span>
        </Link>

        {/* NAV LINKS */}
        <nav className={`navbar-links ${open ? "navbar-links-open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "navbar-link-active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          {/* MOBILE ONLY ACTIONS */}
          <div className="navbar-mobile-actions">
            
            <Link to="/Login" onClick={() => setOpen(false)}>
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="navbar-actions">
          <Link to="/login">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        {/* MOBILE BURGER TOGGLE */}
        <button
          className="navbar-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
