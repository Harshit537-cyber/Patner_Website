import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { minLength } from '../../utils/validators';

const ResetPassword = () => {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!minLength(form.password, 8)) nextErrors.password = 'Use at least 8 characters';
    if (form.password !== form.confirm) nextErrors.confirm = 'Passwords do not match';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    navigate('/login');
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before"
      footer={<>Remembered it? <Link to="/login">Back to login</Link></>}
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="New password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          error={errors.password}
          onChange={handleChange}
        />
        <Input
          label="Confirm password"
          name="confirm"
          type="password"
          placeholder="••••••••"
          value={form.confirm}
          error={errors.confirm}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth loading={loading}>Reset password</Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
