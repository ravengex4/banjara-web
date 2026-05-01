import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export const useTable = (tableName, opts = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const orderBy = opts.orderBy || 'sort_order';
  const ascending = opts.ascending !== false;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase.from(tableName).select('*').order(orderBy, { ascending }).then(({ data, error }) => {
      if (cancelled) return;
      if (error) setError(error);
      else setData(data || []);
      setLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName, refreshTick]);

  const refresh = () => setRefreshTick(t => t + 1);
  return { data, loading, error, refresh };
};
