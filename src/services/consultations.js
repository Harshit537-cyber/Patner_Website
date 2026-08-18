const consultations = [
  { id: 'C-1042', customer: 'Priya Nair', type: 'Video', status: 'upcoming', date: '2026-08-13T10:30:00', amount: 900 },
  { id: 'C-1041', customer: 'Rohit Malhotra', type: 'Chat', status: 'completed', date: '2026-08-11T18:00:00', amount: 320 },
  { id: 'C-1040', customer: 'Sneha Kulkarni', type: 'Call', status: 'completed', date: '2026-08-10T09:15:00', amount: 540 },
  { id: 'C-1039', customer: 'Arjun Verma', type: 'Video', status: 'cancelled', date: '2026-08-09T16:00:00', amount: 0 },
];

export const getConsultations = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return consultations;
};

export const getConsultationById = async (id) => {
  await new Promise((r) => setTimeout(r, 300));
  return consultations.find((c) => c.id === id) || null;
};
