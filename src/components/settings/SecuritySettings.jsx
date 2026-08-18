import Input from '../common/Input';
import Button from '../common/Button';

const SecuritySettings = () => (
  <div className="page-card">
    <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Security</h3>
    <Input label="Current password" type="password" placeholder="••••••••" />
    <Input label="New password" type="password" placeholder="••••••••" />
    <Button variant="outline">Update password</Button>
  </div>
);

export default SecuritySettings;
