export const getDashboardSummary = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return {
    totalEarnings: 184200,
    consultationsThisMonth: 96,
    activeCustomers: 58,
    avgRating: 4.8,
    earningsTrend: [
      { month: 'Mar', value: 42000 },
      { month: 'Apr', value: 51000 },
      { month: 'May', value: 47500 },
      { month: 'Jun', value: 63000 },
      { month: 'Jul', value: 58200 },
      { month: 'Aug', value: 71400 },
    ],
    consultationTrend: [
      { day: 'Mon', calls: 6, chats: 10 },
      { day: 'Tue', calls: 8, chats: 12 },
      { day: 'Wed', calls: 5, chats: 9 },
      { day: 'Thu', calls: 9, chats: 14 },
      { day: 'Fri', calls: 11, chats: 15 },
      { day: 'Sat', calls: 14, chats: 20 },
      { day: 'Sun', calls: 7, chats: 11 },
    ],
  };
};
