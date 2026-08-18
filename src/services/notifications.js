export const getNotifications = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: 'N-1', title: 'New consultation booked', read: false, date: '2026-08-12T09:00:00' },
    { id: 'N-2', title: 'Weekly payout processed', read: true, date: '2026-08-05T10:00:00' },
  ];
};
