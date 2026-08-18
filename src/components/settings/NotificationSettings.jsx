import { useState } from 'react';

const toggles = [
  { key: 'newBooking', label: 'New consultation bookings' },
  { key: 'payout', label: 'Weekly payout confirmations' },
  { key: 'reviews', label: 'New customer reviews' },
  { key: 'marketing', label: 'Product updates & tips' },
];

const NotificationSettings = () => {
  const [state, setState] = useState({ newBooking: true, payout: true, reviews: true, marketing: false });

  const toggle = (key) => setState((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="page-card">
      <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Notifications</h3>
      {toggles.map((t) => (
        <label key={t.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}>
          <span style={{ fontSize: '0.9rem' }}>{t.label}</span>
          <input type="checkbox" checked={state[t.key]} onChange={() => toggle(t.key)} />
        </label>
      ))}
    </div>
  );
};

export default NotificationSettings;
