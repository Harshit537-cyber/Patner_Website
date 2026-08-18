import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { usePartner } from '../../hooks/usePartner';

const PersonalDetails = () => {
  const { profile, updateSection } = usePartner();
  const [form, setForm] = useState({
    fullName: profile.personal.fullName || '',
    dob: profile.personal.dob || '',
    gender: profile.personal.gender || '',
    city: profile.personal.city || '',
    language: profile.personal.language || '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSection('personal', form);
    navigate('/onboarding/professional-details');
  };

  return (
    <OnboardingLayout
      activeKey="personal"
      title="Tell us about yourself"
      subtitle="This information appears on your public partner profile"
    >
      <form onSubmit={handleSubmit}>
        <div className="onboarding-grid">
          <Input label="Full name" name="fullName" value={form.fullName} onChange={handleChange} required />
          <Input label="Date of birth" name="dob" type="date" value={form.dob} onChange={handleChange} required />
          <Select
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={['Male', 'Female', 'Prefer not to say']}
          />
          <Input label="City" name="city" value={form.city} onChange={handleChange} required />
        </div>
        <Select
          label="Primary consultation language"
          name="language"
          value={form.language}
          onChange={handleChange}
          options={['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati']}
        />
        <div className="onboarding-actions">
          <span />
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default PersonalDetails;
