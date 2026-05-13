import { useCallback } from 'react';
import { useFilterContext } from './context/FilterContext';
import Filters from './components/Filters';
import BarChart from './components/BarChart';
import MetricCards from './components/MetricCards';
import ErrorBoundary from './components/ErrorBoundary';
import useFilteredData from './hooks/useFilteredData';
import useCSVExport from './hooks/useCSVExport';
import './App.css';

export default function App() {
  const { state, dispatch } = useFilterContext();
  const { filters, darkMode } = state;

  const filteredData = useFilteredData(filters);
  const exportCSV    = useCSVExport(filteredData);

  const handleFilterChange = useCallback((key, value) => {
    dispatch({ type: 'SET_FILTER', key, value });
  }, [dispatch]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sales Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="reset-btn"
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          >
            ↺ Reset
          </button>
          <button
            className="theme-toggle"
            onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <ErrorBoundary>
          <Filters
            filters={filters}
            onChange={handleFilterChange}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <MetricCards data={filteredData} />
        </ErrorBoundary>
        <ErrorBoundary>
          <BarChart data={filteredData} />
        </ErrorBoundary>
        <button className="export-btn" onClick={exportCSV}>
          ⬇ Export CSV
        </button>
      </main>
    </div>
  );
}