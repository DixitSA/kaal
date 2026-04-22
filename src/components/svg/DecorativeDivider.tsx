interface DecorativeDividerProps {
  width?: number;
  opacity?: number;
  className?: string;
}

export default function DecorativeDivider({
  width = 300,
  opacity = 0.25,
  className = "",
}: DecorativeDividerProps) {
  const color = "#C4A96A";
  const height = 20;
  const buds = 5;
  const spacing = width / (buds + 1);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Horizontal line */}
      <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeWidth="0.75" />

      {/* Lotus buds at intervals */}
      {Array.from({ length: buds }, (_, i) => {
        const x = spacing * (i + 1);
        const y = height / 2;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            {/* Dot center */}
            <circle cx={0} cy={0} r={1.5} fill={color} />
            {/* Left petal */}
            <ellipse cx={-5} cy={0} rx={3} ry={1.5} fill="none" stroke={color} strokeWidth="0.75" />
            {/* Right petal */}
            <ellipse cx={5} cy={0} rx={3} ry={1.5} fill="none" stroke={color} strokeWidth="0.75" />
            {/* Top petal */}
            <ellipse cx={0} cy={-4} rx={1.5} ry={3} fill="none" stroke={color} strokeWidth="0.75" />
            {/* Bottom stalk */}
            <line x1={0} y1={2} x2={0} y2={4} stroke={color} strokeWidth="0.75" />
          </g>
        );
      })}

      {/* Dots between buds */}
      {Array.from({ length: buds - 1 }, (_, i) => {
        const x = spacing * (i + 1) + spacing / 2;
        return (
          <circle key={`d-${i}`} cx={x} cy={height / 2} r={1} fill={color} />
        );
      })}
      {/* End dots */}
      <circle cx={spacing * 0.4} cy={height / 2} r={1} fill={color} />
      <circle cx={width - spacing * 0.4} cy={height / 2} r={1} fill={color} />
    </svg>
  );
}
