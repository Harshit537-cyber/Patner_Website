import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import Button from '../../components/common/Button';
import { usePartner } from '../../hooks/usePartner';

const uploadFields = [
  { key: 'idFront', label: 'ID proof — front side' },
  { key: 'idBack', label: 'ID proof — back side' },
  { key: 'photo', label: 'Recent passport-size photo' },
  { key: 'certificate', label: 'Certification / experience proof (optional)' },
];

const Documents = () => {
  const { profile, updateSection } = usePartner();
  const [files, setFiles] = useState(profile.documents || {});
  const navigate = useNavigate();

  const handleFile = (key, e) => {
    const file = e.target.files?.[0];
    if (file) setFiles((f) => ({ ...f, [key]: file.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSection('documents', files);
    navigate('/onboarding/bank-details');
  };

  return (
    <OnboardingLayout
      activeKey="documents"
      title="Upload your documents"
      subtitle="Clear photos or scans, under 5MB each"
    >
      <form onSubmit={handleSubmit}>
        {uploadFields.map((field) => (
          <label key={field.key} className="onboarding-upload" style={{ display: 'block', cursor: 'pointer' }}>
            <input type="file" style={{ display: 'none' }} onChange={(e) => handleFile(field.key, e)} />
            <strong>{field.label}</strong>
            <div style={{ marginTop: 6, fontSize: '0.85rem' }}>
              {files[field.key] ? `Selected: ${files[field.key]}` : 'Click to upload'}
            </div>
          </label>
        ))}
        <div className="onboarding-actions">
          <Button type="button" variant="ghost" onClick={() => navigate('/onboarding/kyc')}>Back</Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default Documents;
