import { memo } from 'react';
import PropTypes from 'prop-types';
import { CATEGORY_COLORS } from '../data/salesData';

const MetricCards = memo(function MetricCards({ data }) {
  if (!data.length) return <div className="metrics">No data found.</div>;

  const total = data.reduce((sum, d) => sum + d.sales, 0);
  const months = [...new Set(data.map(d => d.month))];
  const avg = Math.round(total / months.length);

  const byMonth = {};
  data.forEach(d => { byMonth[d.month] = (byMonth[d.month] || 0) + d.sales; });
  const topMonth = Object.entries(byMonth).sort((a, b) => b[1] - a[1])[0];

  const byCat = {};
  data.forEach(d => { byCat[d.category] = (byCat[d.category] || 0) + d.sales; });
  const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    { label: 'Total Sales',  value: `${total.toLocaleString()}k` },
    { label: 'Monthly Avg',  value: `${avg.toLocaleString()}k`   },
    { label: 'Top Month',    value: topMonth ? `${topMonth[0]} (${topMonth[1]}k)` : '—' },
    { label: 'Top Category', value: topCat ? topCat[0] : '—',
      color: topCat ? CATEGORY_COLORS[topCat[0]] : undefined },
  ];

  return (
    <div className="metrics">
      {cards.map(card => (
        <div className="metric-card" key={card.label}>
          <div className="metric-label">{card.label}</div>
          <div
            className="metric-value"
            style={card.color ? { color: card.color } : {}}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
});

MetricCards.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month:    PropTypes.string.isRequired,
      quarter:  PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      region:   PropTypes.string.isRequired,
      sales:    PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MetricCards;