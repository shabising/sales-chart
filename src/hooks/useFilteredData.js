import { useMemo } from 'react';
import { RAW_DATA } from '../data/salesData';

export default function useFilteredData(filters) {
  return useMemo(() => {
    return RAW_DATA.filter(d => {
      if (filters.quarter  !== 'all' && d.quarter  !== filters.quarter)  return false;
      if (filters.category !== 'all' && d.category !== filters.category) return false;
      if (filters.region   !== 'all' && d.region   !== filters.region)   return false;
      if (d.sales < filters.minSales) return false;
      return true;
    });
  }, [filters]);
}