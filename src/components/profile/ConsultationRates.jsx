import { useEffect, useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import {
  getMinRate,
  updateMinRate,
} from '../../services/partner';
import './ConsultationRates.css';

const ConsultationRates = ({ rates, onSave }) => {
  const [form, setForm] = useState(rates || {});
  const [updatingMinRate, setUpdatingMinRate] = useState(false);

  useEffect(() => {
    const fetchMinRate = async () => {
      try {
        console.log('GET MIN RATE API CALLING...');

        const response = await getMinRate();

        console.log(
          'MINIMUM RATE GET RESPONSE:',
          JSON.stringify(response, null, 2)
        );

        const minRate =
          response?.data?.minRate ??
          response?.minRate ??
          '';

        setForm((f) => ({
          ...f,
          minRate,
        }));
      } catch (error) {
        console.error('Get Minimum Rate Error:', error);
      }
    };

    fetchMinRate();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateRates = async () => {
    try {
      setUpdatingMinRate(true);

      const minRate = Number(form.minRate);

      if (!minRate || minRate <= 0) {
        alert('Please enter a valid minimum rate.');
        return;
      }

      console.log('PATCH MIN RATE:', minRate);

      const response = await updateMinRate(minRate);

      console.log(
        'MINIMUM RATE UPDATE RESPONSE:',
        JSON.stringify(response, null, 2)
      );

      alert(
        response?.message ||
          'Minimum rate update request submitted for admin approval.'
      );

      onSave(form);
    } catch (error) {
      console.error('Minimum Rate Update Error:', error);

      alert(
        error?.response?.data?.message ||
          'Failed to submit minimum rate update request.'
      );
    } finally {
      setUpdatingMinRate(false);
    }
  };

  return (
    <div className="rates-bento-container">
      {/* Main Glassmorphic Card */}
      <div className="rates-bento-card">
        {/* Top Glow Line */}
        <div className="rates-top-glow" />

        {/* Card Header */}
        <div className="rates-header">
          <div className="rates-title-wrap">
            <span className="rates-eyebrow">
              <span className="sparkle">✦</span> Pricing Settings
            </span>
            <h3 className="rates-title">
              Consultation <span className="highlight">Rates</span>
            </h3>
            <p className="rates-sub">
              Apne per-minute chat, call aur minimum consultation rates configure karein.
            </p>
          </div>

          <div className="rates-badge">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 8v2m0-6c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Dynamic Rates
          </div>
        </div>

        {/* Form Body - Horizontal 3-Column Layout */}
        <div className="rates-body">
          <div className="rates-grid">
            <Input
              label="Chat rate (₹ / min)"
              name="chatRate"
              type="number"
              value={form.chatRate || ''}
              onChange={handleChange}
              inputClassName="rates-custom-input"
              className="rates-custom-input"
            />

            <Input
              label="Call rate (₹ / min)"
              name="callRate"
              type="number"
              value={form.callRate || ''}
              onChange={handleChange}
              inputClassName="rates-custom-input"
              className="rates-custom-input"
            />

            <Input
              label="Minimum rate (₹)"
              name="minRate"
              type="number"
              value={form.minRate || ''}
              onChange={handleChange}
              inputClassName="rates-custom-input"
              className="rates-custom-input"
            />
          </div>

          {/* Footer Actions */}
          <div className="rates-footer">
            <div className="rates-status-pill">
              <span className="pulse-dot"></span>
              Admin Approval Required
            </div>

            <Button
              onClick={handleUpdateRates}
              disabled={updatingMinRate}
              className="rates-save-btn"
            >
              <span>{updatingMinRate ? 'Updating...' : 'Update rates'}</span>
              <svg
                className="btn-arrow-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRates;