export const getEarnings = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return {
    available: 18420,
    pending: 3200,
    lifetime: 184200,
    history: [
      { date: '2026-08-05', description: 'Weekly payout', amount: 14200 },
      { date: '2026-07-29', description: 'Weekly payout', amount: 12800 },
    ],
  };
};
