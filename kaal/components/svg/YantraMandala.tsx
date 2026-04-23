import { memo } from "react";

interface YantraMandalaProps {
  size?: number;
  opacity?: number;
  className?: string;
}

function YantraMandalaInner({
  size = 500,
  opacity = 0.12,
  className = "",
}: YantraMandalaProps) {
  const cx = size / 2;
  const cy = size / 2;
  const color = "#C4A96A";

  const petals = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8;
    const r = size * 0.32;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    const r2 = size * 0.32;
    const px2 = cx + r2 * Math.cos(angle + Math.PI / 8);
    const py2 = cy + r2 * Math.sin(angle + Math.PI / 8);
    return `M ${cx} ${cy} Q ${px} ${py} ${px2} ${py2}`;
  });

  const outerPetals = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 16;
    const r = size * 0.44;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    const r2 = size * 0.44;
    const px2 = cx + r2 * Math.cos(angle + Math.PI / 16);
    const py2 = cy + r2 * Math.sin(angle + Math.PI / 16);
    return `M ${cx} ${cy} Q ${px} ${py} ${px2} ${py2}`;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Outer circles */}
      <circle cx={cx} cy={cy} r={size * 0.48} fill="none" stroke={color} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={size * 0.42} fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={size * 0.36} fill="none" stroke={color} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={size * 0.28} fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={size * 0.20} fill="none" stroke={color} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={size * 0.12} fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={size * 0.04} fill={color} />

      {/* Outer petals (16) */}
      {outerPetals.map((d, i) => (
        <path key={`op-${i}`} d={d} fill="none" stroke={color} strokeWidth="0.75" />
      ))}

      {/* Inner petals (8) */}
      {petals.map((d, i) => (
        <path key={`ip-${i}`} d={d} fill="none" stroke={color} strokeWidth="1" />
      ))}

      {/* Triangle upward */}
      <polygon
        points={`${cx},${cy - size * 0.18} ${cx - size * 0.16},${cy + size * 0.09} ${cx + size * 0.16},${cy + size * 0.09}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
      {/* Triangle downward */}
      <polygon
        points={`${cx},${cy + size * 0.18} ${cx - size * 0.16},${cy - size * 0.09} ${cx + size * 0.16},${cy - size * 0.09}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
      />

      {/* Dot ring */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 12;
        const r = size * 0.24;
        return (
          <circle
            key={`dot-${i}`}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r={size * 0.008}
            fill={color}
          />
        );
      })}
    </svg>
  );
}

const YantraMandala = memo(YantraMandalaInner);
export default YantraMandala;
