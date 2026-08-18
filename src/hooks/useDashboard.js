import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../services/dashboard';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDashboardSummary().then((res) => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return { data, loading };
};
