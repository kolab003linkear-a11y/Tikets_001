interface CountdownRingProps {
  secondsRemaining: number;
  totalSeconds?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CountdownRing({
  secondsRemaining,
  totalSeconds = 30,
  size = 48,
  strokeWidth = 4,
  className = "",
}: CountdownRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, secondsRemaining / totalSeconds));
  const strokeDashoffset = circumference - progress * circumference;

  // Determine color based on time remaining
  let strokeColor = "#14B8A6"; // Teal accent
  if (secondsRemaining <= 5) {
    strokeColor = "#F43F5E"; // Rose alert
  } else if (secondsRemaining <= 10) {
    strokeColor = "#F59E0B"; // Amber warning
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg className="-rotate-90 transform" width={size} height={size}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800"
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
          }}
        />
      </svg>
      {/* Centered Second Number */}
      <span className="absolute font-mono text-xs font-bold text-slate-200">
        {secondsRemaining}s
      </span>
    </div>
  );
}
