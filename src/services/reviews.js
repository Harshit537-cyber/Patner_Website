export const getReviews = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: 'R-1', customer: 'Priya Nair', rating: 5, comment: 'Very insightful reading, thank you!' },
    { id: 'R-2', customer: 'Sneha Kulkarni', rating: 5, comment: 'Accurate and calming session.' },
  ];
};
