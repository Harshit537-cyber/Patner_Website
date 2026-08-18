import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';

const WithdrawModal = ({ open, onClose, balance, minWithdraw = 500, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const value = Number(amount);
    if (!value || value < minWithdraw) {
      setError(`Minimum withdrawal is ${formatCurrency(minWithdraw)}`);
      return;
    }
    if (value > balance) {
      setError('Amount exceeds available balance');
      return;
    }
    setError('');
    setLoading(true);
    await onWithdraw(value);
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Withdraw earnings"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Withdraw</Button>
        </>
      }
    >
      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 14 }}>
        Available balance: {formatCurrency(balance)}
      </p>
      <Input
        label="Amount to withdraw"
        type="number"
        placeholder="e.g. 5000"
        value={amount}
        error={error}
        onChange={(e) => setAmount(e.target.value)}
      />
    </Modal>
  );
};

export default WithdrawModal;
