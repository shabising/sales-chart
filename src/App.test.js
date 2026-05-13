import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  test('Dashboard başlığı görünür', () => {
    render(<App />);
    expect(screen.getByText('Sales Dashboard')).toBeInTheDocument();
  });

  test('Filter dropdown-ları görünür', () => {
    render(<App />);
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Region')).toBeInTheDocument();
  });

  test('Reset düyməsi işləyir', async () => {
    render(<App />);
    const selects = screen.getAllByRole('combobox');
    await userEvent.selectOptions(selects[0], 'Q1');
    const resetBtn = screen.getByText('↺ Reset');
    await userEvent.click(resetBtn);
    expect(selects[0].value).toBe('all');
  });

  test('Dark mode toggle işləyir', async () => {
    render(<App />);
    const toggleBtn = screen.getByText('🌙 Dark');
    await userEvent.click(toggleBtn);
    expect(screen.getByText('☀️ Light')).toBeInTheDocument();
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  test('Export CSV düyməsi görünür', () => {
    render(<App />);
    expect(screen.getByText('⬇ Export CSV')).toBeInTheDocument();
  });
});