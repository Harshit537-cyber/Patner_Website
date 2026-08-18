import { useContext } from 'react';
import { PartnerContext } from '../context/PartnerContext';

export const usePartner = () => {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error('usePartner must be used within PartnerProvider');
  return ctx;
};
