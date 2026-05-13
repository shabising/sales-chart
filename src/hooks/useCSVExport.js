import { useCallback } from 'react';

export default function useCSVExport(data) {
  return useCallback(() => {
    const headers = ['Month', 'Quarter', 'Category', 'Region', 'Sales (k)'];
    const rows = data.map(d => [
      d.month, d.quarter, d.category, d.region, d.sales
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);
}