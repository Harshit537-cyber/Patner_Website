import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { usePartner } from '../../hooks/usePartner';

const ProfessionalDetails = () => {
  const { profile, updateSection } = usePartner();
  const [form, setForm] = useState({
    specialization: profile.professional.specialization || '',
    experience: profile.professional.experience || '',
    bio: profile.professional.bio || '',
    chatRate: profile.professional.chatRate || '',
    callRate: profile.professional.callRate || '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSection('professional', form);
    navigate('/onboarding/kyc');
  };

  return (
    <OnboardingLayout
      activeKey="professional"
      title="Your practice"
      subtitle="Help clients understand what you specialize in"
    >
      <form onSubmit={handleSubmit}>
        <div className="onboarding-grid">
          <Select
            label="Specialization"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            options={['Vedic Astrology', 'Tarot Reading', 'Numerology', 'Vastu', 'Palmistry', 'Western Astrology']}
          />
          <Select
            label="Years of experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            options={['1-2 years', '3-5 years', '6-10 years', '10+ years']}
          />
          <Input label="Chat rate (₹ / min)" name="chatRate" type="number" value={form.chatRate} onChange={handleChange} required />
          <Input label="Call rate (₹ / min)" name="callRate" type="number" value={form.callRate} onChange={handleChange} required />
        </div>
        <Input
          label="Short bio"
          name="bio"
          placeholder="A few lines about your practice and approach"
          value={form.bio}
          onChange={handleChange}
        />
        <div className="onboarding-actions">
          <Button type="button" variant="ghost" onClick={() => navigate('/onboarding/personal-details')}>Back</Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default ProfessionalDetails;
