import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { isValidEmail } from '../../utils/validators';
import { requestPasswordReset } from '../../services/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    await requestPasswordReset(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a link to reset it"
      footer={<>Remembered it? <Link to="/login">Back to login</Link></>}
    >
      {sent ? (
        <p style={{ color: 'var(--color-success)', fontWeight: 600 }}>
          Check your inbox — a reset link is on its way to {email}.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            error={error}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" fullWidth loading={loading}>Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
