import { cn } from '@/lib/utils';
import type { Phase, Mode } from '@/types/timer';

interface TimerDisplayProps {
  currentTime: number;
  phase: Phase;
  mode: Mode;
  currentWord: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getTimerColor(currentTime: number): string {
  if (currentTime <= 5) return 'text-timer-danger';
  if (currentTime <= 10) return 'text-timer-warning';
  return 'text-timer-active';
}

export function TimerDisplay({ currentTime, phase, mode, currentWord }: TimerDisplayProps) {
  return (
    <div className="text-center">
      {/* Phase Indicator */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-primary">
          {mode === 'special'
            ? `מילה ${currentWord}`
            : phase === 'turn'
              ? 'תור הסבר'
              : 'זמן ניחושים'}
        </span>
      </div>

      {/* Timer Number */}
      <div
        className={cn(
          'text-8xl font-bold mb-8 transition-colors duration-300',
          getTimerColor(currentTime),
        )}
      >
        {formatTime(currentTime)}
      </div>
    </div>
  );
}
