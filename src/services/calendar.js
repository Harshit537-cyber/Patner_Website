export const getAvailability = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return {
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    slots: ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00'],
  };
};

export const updateAvailability = async (payload) => {
  await new Promise((r) => setTimeout(r, 300));
  return { success: true, ...payload };
};
