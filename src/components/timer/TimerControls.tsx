import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, RefreshCw } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isFinished: boolean;
  mode: 'regular' | 'special';
  phase: 'turn' | 'guess';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNextWord: () => void;
}

function getButtonText(
  isFinished: boolean,
  mode: 'regular' | 'special',
  phase: 'turn' | 'guess',
): string {
  if (isFinished) return 'תור חדש';
  if (mode === 'special') return 'תור מיוחד';
  if (phase === 'turn') return 'תור';
  return 'ניחושים';
}

export function TimerControls({
  isRunning,
  isFinished,
  mode,
  phase,
  onStart,
  onPause,
  onReset,
  onNextWord,
}: TimerControlsProps) {
  return (
    <div className="text-center">
      {/* Main Action Button */}
      <Button
        onClick={isRunning ? onPause : onStart}
        size="lg"
        className="w-48 h-48 rounded-full text-3xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {isRunning ? (
          <>
            <Pause className="w-12 h-12 ms-2" />
            השהה
          </>
        ) : (
          <>
            <Play className="w-12 h-12 ms-2" />
            {getButtonText(isFinished, mode, phase)}
          </>
        )}
      </Button>

      {/* Reset and Next Word Buttons */}
      <div className="mt-6 flex gap-4 justify-center">
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="rounded-full px-8 py-4"
        >
          <RotateCcw className="w-5 h-5 ms-2" />
          איפוס
        </Button>

        {mode === 'special' && (
          <Button
            onClick={onNextWord}
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-4"
          >
            <RefreshCw className="w-5 h-5 ms-2" />
            למילה הבאה
          </Button>
        )}
      </div>
    </div>
  );
}
