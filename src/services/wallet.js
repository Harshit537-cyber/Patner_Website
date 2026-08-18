export const getWallet = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return { balance: 18420, minWithdraw: 500 };
};

export const requestWithdrawal = async (amount) => {
  await new Promise((r) => setTimeout(r, 400));
  return { success: true, amount, status: 'processing' };
};
