import Input from '../common/Input';
import Button from '../common/Button';

const AccountSettings = () => (
  <div className="page-card">
    <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Account</h3>
    <Input label="Email" type="email" defaultValue="radhika.sharma@example.com" />
    <Input label="Mobile number" type="tel" defaultValue="98765 43210" />
    <Button variant="outline">Save changes</Button>
  </div>
);

export default AccountSettings;
