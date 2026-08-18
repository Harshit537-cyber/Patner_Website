import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const EditProfile = ({ profile, onSave }) => {
  const [form, setForm] = useState(profile);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="page-card">
      <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Edit profile</h3>
      <Input label="Full name" name="fullName" value={form.fullName || ''} onChange={handleChange} />
      <Input label="City" name="city" value={form.city || ''} onChange={handleChange} />
      <Input label="Short bio" name="bio" value={form.bio || ''} onChange={handleChange} />
      <Button onClick={() => onSave(form)}>Save changes</Button>
    </div>
  );
};

export default EditProfile;
