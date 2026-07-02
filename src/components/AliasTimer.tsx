import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { usePersistedSettings } from '@/hooks/usePersistedSettings';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { SettingsPanel } from '@/components/timer/SettingsPanel';

const AliasTimer = () => {
  const [settings, setSettings] = usePersistedSettings();
  const { timer, start, pause, reset, nextWord, toggleMode, updateTimerToSettings } =
    useTimer(settings);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-4">
      {/* Mode Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMode}
        className="absolute top-4 start-4 text-primary hover:text-primary/80"
      >
        <RefreshCw className="h-4 w-4 ms-2" />
        {timer.mode === 'regular' ? 'תור מיוחד' : 'תור רגיל'}
      </Button>

      {/* Settings Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowSettings(true)}
        className="absolute top-4 end-4 text-primary hover:text-primary/80"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Panel */}
      <SettingsPanel
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onChange={setSettings}
        onApply={updateTimerToSettings}
      />

      {/* Main Timer Display */}
      <TimerDisplay
        currentTime={timer.currentTime}
        phase={timer.phase}
        mode={timer.mode}
        currentWord={timer.currentWord}
      />

      {/* Timer Controls */}
      <TimerControls
        isRunning={timer.isRunning}
        isFinished={timer.isFinished}
        mode={timer.mode}
        phase={timer.phase}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onNextWord={nextWord}
      />
    </div>
  );
};

export default AliasTimer;
