import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { usePartner } from '../../hooks/usePartner';
import { isValidIFSC, isRequired } from '../../utils/validators';
import { submitOnboardingStep } from '../../services/partner';

const BankDetails = () => {
  const { profile, updateSection } = usePartner();
  const [form, setForm] = useState({
    accountHolder: profile.bank.accountHolder || '',
    accountNumber: profile.bank.accountNumber || '',
    ifsc: profile.bank.ifsc || '',
    bankName: profile.bank.bankName || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!isRequired(form.accountHolder)) nextErrors.accountHolder = 'Required';
    if (!isRequired(form.accountNumber)) nextErrors.accountNumber = 'Required';
    if (!isValidIFSC(form.ifsc)) nextErrors.ifsc = 'Enter a valid IFSC code';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    updateSection('bank', form);
    await submitOnboardingStep('bank', form);
    setLoading(false);
    navigate('/onboarding/application-status');
  };

  return (
    <OnboardingLayout
      activeKey="bank"
      title="Where should we send your earnings?"
      subtitle="Payouts are made weekly to this account"
    >
      <form onSubmit={handleSubmit}>
        <Input label="Account holder name" name="accountHolder" value={form.accountHolder} error={errors.accountHolder} onChange={handleChange} />
        <div className="onboarding-grid">
          <Input label="Account number" name="accountNumber" value={form.accountNumber} error={errors.accountNumber} onChange={handleChange} />
          <Input label="IFSC code" name="ifsc" placeholder="ABCD0123456" value={form.ifsc} error={errors.ifsc} onChange={handleChange} />
        </div>
        <Input label="Bank name" name="bankName" value={form.bankName} onChange={handleChange} />
        <div className="onboarding-actions">
          <Button type="button" variant="ghost" onClick={() => navigate('/onboarding/documents')}>Back</Button>
          <Button type="submit" loading={loading}>Submit application</Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default BankDetails;
