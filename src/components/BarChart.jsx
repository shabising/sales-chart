import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { CATEGORY_COLORS, MONTHS_ORDER } from '../data/salesData';
import useAnimatedBars from '../hooks/useAnimatedBars';
import Tooltip from './Tooltip';
import PropTypes from 'prop-types';

function aggregateData(data, activeCats) {
  const months = [...new Set(data.map(d => d.month))].sort(
    (a, b) => MONTHS_ORDER.indexOf(a) - MONTHS_ORDER.indexOf(b)
  );
  const cats = activeCats.filter(c =>
    data.some(d => d.category === c)
  );

  const result = {};
  months.forEach(m => {
    cats.forEach(c => {
      const key = `${m}__${c}`;
      result[key] = data
        .filter(d => d.month === m && d.category === c)
        .reduce((sum, d) => sum + d.sales, 0);
    });
  });

  return { months, cats, result };
}

function BarChart({ data }) {
  const canvasRef = useRef(null);
  const [activeCats, setActiveCats] = useState(
    ['Electronics', 'Apparel', 'Home', 'Sports']
  );
  const [tooltip, setTooltip] = useState({ visible: false });
  const hoverZonesRef = useRef([]);

  const { months, cats, result } = aggregateData(data, activeCats);
  const animated = useAnimatedBars(result);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    if (!months.length || !cats.length) return;

    const PAD_L = 50, PAD_R = 20, PAD_T = 20, PAD_B = 40;
    const cW = W - PAD_L - PAD_R;
    const cH = H - PAD_T - PAD_B;

    const allTotals = months.map(m =>
      cats.reduce((sum, c) => sum + (animated[`${m}__${c}`] || 0), 0)
    );
    const maxVal  = Math.max(...allTotals, 1);
    const niceMax = Math.ceil(maxVal / 50) * 50;

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const gridColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const textColor  = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';
    const labelColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)';

    for (let i = 0; i <= 5; i++) {
      const v = Math.round((niceMax / 5) * i);
      const y = PAD_T + cH - (v / niceMax) * cH;
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      ctx.moveTo(PAD_L, y);
      ctx.lineTo(PAD_L + cW, y);
      ctx.stroke();
      ctx.font = '11px sans-serif';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'right';
      ctx.fillText(`${v}k`, PAD_L - 6, y + 4);
    }

    const groupW   = cW / months.length;
    const barPad   = groupW * 0.18;
    const groupInW = groupW - barPad * 2;
    const barW     = groupInW / cats.length;
    const zones    = [];

    months.forEach((m, mi) => {
      const gx = PAD_L + mi * groupW + barPad;

      cats.forEach((c, ci) => {
        const val = animated[`${m}__${c}`] || 0;
        const bx  = gx + ci * barW;
        const bh  = (val / niceMax) * cH;
        const by  = PAD_T + cH - bh;
        const r   = Math.min(3, barW / 2, bh / 2);

        ctx.beginPath();
        ctx.fillStyle = CATEGORY_COLORS[c];
        ctx.globalAlpha = 0.88;
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + barW - r, by);
        ctx.quadraticCurveTo(bx + barW, by, bx + barW, by + r);
        ctx.lineTo(bx + barW, by + bh);
        ctx.lineTo(bx, by + bh);
        ctx.lineTo(bx, by + r);
        ctx.quadraticCurveTo(bx, by, bx + r, by);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        zones.push({ x: bx, y: by, w: barW, h: bh, month: m, category: c, sales: Math.round(val) });
      });

      ctx.font = '11px sans-serif';
      ctx.fillStyle = labelColor;
      ctx.textAlign = 'center';
      ctx.fillText(m, gx + groupInW / 2, H - PAD_B + 16);
    });

    hoverZonesRef.current = zones;
  }, [animated, months, cats]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const observer = new ResizeObserver(() => draw());
    const canvas = canvasRef.current;
    if (canvas) observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = hoverZonesRef.current.find(
      z => mx >= z.x && mx <= z.x + z.w && my >= z.y && my <= z.y + z.h
    );
    if (hit) {
      setTooltip({ visible: true, x: e.clientX, y: e.clientY, ...hit });
    } else {
      setTooltip({ visible: false });
    }
  };

  const toggleCat = (cat) => {
    setActiveCats(prev =>
      prev.includes(cat)
        ? prev.length > 1 ? prev.filter(c => c !== cat) : prev
        : [...prev, cat]
    );
  };

  return (
    <div className="chart-wrapper">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '300px', display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip({ visible: false })}
      />
      <Tooltip tooltip={tooltip} />

      <div className="legend">
        {['Electronics', 'Apparel', 'Home', 'Sports'].map(cat => (
          <div
            key={cat}
            className="legend-item"
            onClick={() => toggleCat(cat)}
            style={{ opacity: activeCats.includes(cat) ? 1 : 0.35 }}
          >
            <span
              className="legend-dot"
              style={{ background: CATEGORY_COLORS[cat] }}
            />
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}

BarChart.propTypes = {
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

export default memo(BarChart);
 