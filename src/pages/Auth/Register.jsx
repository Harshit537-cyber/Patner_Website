import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { isValidPhone, isValidEmail, isRequired } from '../../utils/validators';
import { registerPartner } from '../../services/authService';

const Register = () => {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    specialties: '',
    languages: '',
    experience: '',
    qualification: '',
    expectedSalary: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanPhone = form.phone.replace(/\D/g, '');

    const nextErrors = {};

    if (!isRequired(form.fullName)) {
      nextErrors.fullName = 'Enter your full name';
    }

    if (!isValidPhone(cleanPhone)) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!isRequired(form.dateOfBirth)) {
      nextErrors.dateOfBirth = 'Enter your date of birth';
    }

    if (!isRequired(form.gender)) {
      nextErrors.gender = 'Select your gender';
    }

    if (!isRequired(form.city)) {
      nextErrors.city = 'Enter your city';
    }

    if (!isRequired(form.specialties)) {
      nextErrors.specialties = 'Enter your specialties';
    }

    if (!isRequired(form.languages)) {
      nextErrors.languages = 'Enter your languages';
    }

    if (!isRequired(form.experience)) {
      nextErrors.experience = 'Enter your experience';
    }

    if (!isRequired(form.qualification)) {
      nextErrors.qualification = 'Enter your qualification';
    }

    if (!isRequired(form.expectedSalary)) {
      nextErrors.expectedSalary = 'Enter your expected salary';
    }

    if (!isRequired(form.bio)) {
      nextErrors.bio = 'Enter your bio';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);

      const payload = {
        fullName: form.fullName.trim(),
        phone: cleanPhone,
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        city: form.city.trim(),
        specialties: form.specialties
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        languages: form.languages
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        experience: Number(form.experience),
        qualification: form.qualification.trim(),
        expectedSalary: Number(form.expectedSalary),
        bio: form.bio.trim(),
      };

      console.log(
        'REGISTER PAYLOAD:',
        JSON.stringify(payload, null, 2)
      );

      const response = await registerPartner(payload);

      console.log(
        'REGISTER API RESPONSE:',
        JSON.stringify(response, null, 2)
      );

      navigate('/verify-otp', {
        state: {
          phone: cleanPhone,
        },
      });
    } catch (error) {
      console.error('Register API Error:', error);

      setErrors({
        api:
          error?.response?.data?.message ||
          error?.message ||
          'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Become a partner"
      subtitle="Start with the basics — we'll guide you through the rest"
      footer={
        <>
          Already a partner? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {errors.api && (
          <div
            style={{
              color: 'var(--color-error)',
              marginBottom: 16,
              fontSize: '0.9rem',
            }}
          >
            {errors.api}
          </div>
        )}

        <Input
          label="Full name"
          name="fullName"
          placeholder="Your full name"
          value={form.fullName}
          error={errors.fullName}
          onChange={handleChange}
        />

        <Input
          label="Mobile number"
          name="phone"
          type="tel"
          placeholder="98765 43210"
          value={form.phone}
          error={errors.phone}
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          error={errors.email}
          onChange={handleChange}
        />

        <Input
          label="Date of birth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          error={errors.dateOfBirth}
          onChange={handleChange}
        />

        <Input
          label="Gender"
          name="gender"
          placeholder="Male / Female / Other"
          value={form.gender}
          error={errors.gender}
          onChange={handleChange}
        />

        <Input
          label="City"
          name="city"
          placeholder="Your city"
          value={form.city}
          error={errors.city}
          onChange={handleChange}
        />

        <Input
          label="Specialties"
          name="specialties"
          placeholder="Vedic, Tarot, Numerology"
          value={form.specialties}
          error={errors.specialties}
          onChange={handleChange}
        />

        <Input
          label="Languages"
          name="languages"
          placeholder="Hindi, English"
          value={form.languages}
          error={errors.languages}
          onChange={handleChange}
        />

        <Input
          label="Experience (years)"
          name="experience"
          type="number"
          placeholder="5"
          value={form.experience}
          error={errors.experience}
          onChange={handleChange}
        />

        <Input
          label="Qualification"
          name="qualification"
          placeholder="B.Tech"
          value={form.qualification}
          error={errors.qualification}
          onChange={handleChange}
        />

        <Input
          label="Expected salary"
          name="expectedSalary"
          type="number"
          placeholder="30000"
          value={form.expectedSalary}
          error={errors.expectedSalary}
          onChange={handleChange}
        />

        <Input
          label="Bio"
          name="bio"
          placeholder="Tell us about your experience"
          value={form.bio}
          error={errors.bio}
          onChange={handleChange}
        />

        <Button type="submit" fullWidth loading={loading}>
          Continue
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;