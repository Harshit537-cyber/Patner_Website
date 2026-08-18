const customers = [
  { id: 'U-501', name: 'Priya Nair', consultations: 6, lastVisit: '2026-08-13', rating: 5 },
  { id: 'U-502', name: 'Rohit Malhotra', consultations: 2, lastVisit: '2026-08-11', rating: 4 },
  { id: 'U-503', name: 'Sneha Kulkarni', consultations: 9, lastVisit: '2026-08-10', rating: 5 },
];

export const getCustomers = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return customers;
};

export const getCustomerById = async (id) => {
  await new Promise((r) => setTimeout(r, 300));
  return customers.find((c) => c.id === id) || null;
};
