interface CircularTimerProps {
  timeRemaining: number;
  totalTime: number;
  isResting: boolean;
}

export const CircularTimer = ({
  timeRemaining,
  totalTime,
  isResting,
}: CircularTimerProps) => {
  const progress = (timeRemaining / totalTime) * 100;
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColorClass = () => {
    if (isResting) return "stroke-timer-rest";
    if (timeRemaining <= 3) return "stroke-timer-warning";
    return "stroke-timer-active";
  };

  const getGlowColor = () => {
    if (isResting) return "drop-shadow-[0_0_20px_rgba(22,163,74,0.6)]";
    if (timeRemaining <= 3) return "drop-shadow-[0_0_20px_rgba(255,193,7,0.8)]";
    return "drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]";
  };

  const shouldPulse = !isResting && timeRemaining > 3;
  const shouldShake = !isResting && timeRemaining <= 3;

  return (
    <div className="relative w-72 h-72 mx-auto">
      <svg
        className={`transform -rotate-90 w-full h-full ${getGlowColor()} transition-all duration-300 ${
          shouldShake ? "animate-[shake_0.5s_ease-in-out_infinite]" : ""
        }`}
        viewBox="0 0 280 280"
      >
        {/* Outer glow ring */}
        <circle
          cx="140"
          cy="140"
          r="130"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className={`${getColorClass()} opacity-20`}
        />

        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r="120"
          stroke="currentColor"
          strokeWidth="16"
          fill="none"
          className="text-muted opacity-10"
        />

        {/* Progress circle with gradient */}
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={
                isResting
                  ? "hsl(142, 76%, 45%)"
                  : timeRemaining <= 3
                  ? "hsl(35, 100%, 55%)"
                  : "hsl(20, 95%, 55%)"
              }
            />
            <stop
              offset="100%"
              stopColor={
                isResting
                  ? "hsl(142, 76%, 55%)"
                  : timeRemaining <= 3
                  ? "hsl(35, 100%, 65%)"
                  : "hsl(20, 100%, 65%)"
              }
            />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="140"
          cy="140"
          r="120"
          stroke="url(#progressGradient)"
          strokeWidth="16"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-300 ${
            shouldPulse ? "animate-pulse-glow" : ""
          }`}
          strokeLinecap="round"
          filter="url(#glow)"
        />
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div
            className={`text-7xl font-mono font-bold text-foreground tabular-nums ${
              shouldShake ? "animate-[shake_0.5s_ease-in-out_infinite]" : ""
            }`}
          >
            {timeRemaining}
          </div>
          <div className="text-sm text-muted-foreground mt-2 font-body uppercase tracking-wider">
            {isResting ? "Descanso" : "Segundos"}
          </div>
        </div>
      </div>
    </div>
  );
};
