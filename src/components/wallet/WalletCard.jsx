import { formatCurrency } from '../../utils/formatters';

const WalletCard = ({ balance, onWithdraw }) => (
  <div className="page-card" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', color: '#fff', border: 'none' }}>
    <p style={{ fontSize: '0.8rem', opacity: 0.85, margin: '0 0 8px' }}>Available balance</p>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: '0 0 20px' }}>{formatCurrency(balance)}</p>
    <button
      onClick={onWithdraw}
      style={{ background: 'var(--color-accent-gold)', color: 'var(--color-heading)', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
    >
      Withdraw funds
    </button>
  </div>
);

export default WalletCard;
