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
    if (isResting) return 'stroke-timer-rest';
    if (timeRemaining <= 3) return 'stroke-timer-warning';
    return 'stroke-timer-active';
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 280 280"
      >
        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r="120"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
          className="text-muted opacity-20"
        />

        {/* Progress circle */}
        <circle
          cx="140"
          cy="140"
          r="120"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${getColorClass()} transition-all duration-300`}
          strokeLinecap="round"
        />
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-foreground">
            {timeRemaining}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {isResting ? 'Descanso' : 'Segundos'}
          </div>
        </div>
      </div>
    </div>
  );
};
