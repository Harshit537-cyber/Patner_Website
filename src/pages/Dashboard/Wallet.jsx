import { useEffect, useState } from 'react';
import WalletCard from '../../components/wallet/WalletCard';
import WithdrawModal from '../../components/wallet/WithdrawModal';
import TransactionTable from '../../components/wallet/TransactionTable';
import Loader from '../../components/common/Loader';
import { getWallet, requestWithdrawal } from '../../services/wallet';
import { getEarnings } from '../../services/earnings';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getWallet().then(setWallet);
    getEarnings().then((e) => setHistory(e.history.map((h) => ({ ...h, status: 'completed' }))));
  }, []);

  if (!wallet) return <Loader label="Loading wallet..." />;

  const handleWithdraw = async (amount) => {
    const res = await requestWithdrawal(amount);
    setHistory((prev) => [{ description: 'Withdrawal request', date: new Date().toISOString(), amount, status: res.status }, ...prev]);
    setWallet((w) => ({ ...w, balance: w.balance - amount }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <WalletCard balance={wallet.balance} onWithdraw={() => setModalOpen(true)} />
      <div className="page-card">
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Transaction history</h3>
        <TransactionTable transactions={history} />
      </div>
      <WithdrawModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        balance={wallet.balance}
        minWithdraw={wallet.minWithdraw}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
};

export default Wallet;
