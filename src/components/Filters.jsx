import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES, REGIONS, QUARTERS } from '../data/salesData';

const Filters = memo(function Filters({ filters, onChange }) {
  const handle = useCallback((key, value) => onChange(key, value), [onChange]);

  return (
    <div className="filters">

      <div className="filter-group">
        <label>Date Range</label>
        <select
          value={filters.quarter}
          onChange={e => handle('quarter', e.target.value)}
        >
          <option value="all">All Quarters</option>
          {QUARTERS.map(q => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters.category}
          onChange={e => handle('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Region</label>
        <select
          value={filters.region}
          onChange={e => handle('region', e.target.value)}
        >
          <option value="all">All Regions</option>
          {REGIONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Min Sales: <strong>{filters.minSales}k</strong></label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={filters.minSales}
          onChange={e => handle('minSales', Number(e.target.value))}
        />
      </div>

    </div>
  );
});

Filters.propTypes = {
  filters: PropTypes.shape({
    quarter:  PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    region:   PropTypes.string.isRequired,
    minSales: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Filters;