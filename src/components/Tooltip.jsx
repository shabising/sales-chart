export default function Tooltip({ tooltip }) {
  if (!tooltip.visible) return null;

  return (
    <div
      className="tooltip"
      style={{
        left: tooltip.x + 12,
        top:  tooltip.y - 40,
      }}
    >
      <div className="tooltip-title">{tooltip.month} · {tooltip.category}</div>
      <div className="tooltip-value">{tooltip.sales}k units</div>
    </div>
  );
}