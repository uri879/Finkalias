import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, Play, Pause, RotateCcw, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TimerState {
  isRunning: boolean;
  currentTime: number;
  phase: 'turn' | 'guess';
  isFinished: boolean;
  mode: 'regular' | 'special';
  currentWord: number;
}

interface TimerSettings {
  turnTime: number;
  guessTime: number;
  specialTurnTime: number;
}

const AliasTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>({
    turnTime: 60,
    guessTime: 30,
    specialTurnTime: 45
  });
  
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    currentTime: 60,
    phase: 'turn',
    isFinished: false,
    mode: 'regular',
    currentWord: 1
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play beep sound
  const playBeep = (frequency: number = 800, duration: number = 200) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  };

  // Play buzzer sound
  const playBuzzer = () => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 1);
  };

  // Timer logic
  useEffect(() => {
    if (timer.isRunning && timer.currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          const newTime = prev.currentTime - 1;
          
          // Warning beeps (last 5 seconds)
          if (newTime <= 5 && newTime > 0) {
            playBeep(1000, 150);
          }
          
          // Time's up - buzzer and phase transition
          if (newTime === 0) {
            playBuzzer();
            
            if (prev.mode === 'special') {
              // Special mode - just end the turn
              toast({
                title: "התור הסתיים!",
                description: "לחצו על איפוס למילה הבאה",
              });
              return {
                ...prev,
                currentTime: settings.specialTurnTime,
                isRunning: false,
                isFinished: true
              };
            } else if (prev.phase === 'turn') {
              // Regular mode - switch to guess phase
              toast({
                title: "זמן הניחושים!",
                description: `יש לכם ${settings.guessTime} שניות לנחש`,
              });
              return {
                ...prev,
                currentTime: settings.guessTime,
                phase: 'guess'
              };
            } else {
              // End of guess phase - back to turn
              toast({
                title: "התור הסתיים!",
                description: "לחצו על התור הבא כדי להתחיל מחדש",
              });
              return {
                ...prev,
                currentTime: settings.turnTime,
                phase: 'turn',
                isRunning: false,
                isFinished: true
              };
            }
          }
          
          return { ...prev, currentTime: newTime };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.currentTime, timer.phase, settings, toast]);

  const startTimer = () => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    setTimer(prev => ({
      ...prev,
      isRunning: true,
      isFinished: false
    }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    const newTime = timer.mode === 'special' ? settings.specialTurnTime : settings.turnTime;
    
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      currentTime: newTime,
      phase: 'turn',
      isFinished: false
    }));
  };

  const nextWord = () => {
    const newWord = timer.currentWord < 5 ? timer.currentWord + 1 : 1;
    
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      currentTime: settings.specialTurnTime,
      phase: 'turn',
      isFinished: false,
      currentWord: newWord
    }));
  };

  const updateTimerToSettings = () => {
    let newTime;
    if (timer.mode === 'special') {
      newTime = settings.specialTurnTime;
    } else {
      newTime = timer.phase === 'turn' ? settings.turnTime : settings.guessTime;
    }
    
    setTimer(prev => ({
      ...prev,
      currentTime: newTime,
      isRunning: false
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timer.currentTime <= 5) return 'text-timer-danger';
    if (timer.currentTime <= 10) return 'text-timer-warning';
    return 'text-timer-active';
  };

  const toggleMode = () => {
    const newMode = timer.mode === 'regular' ? 'special' : 'regular';
    const newTime = newMode === 'special' ? settings.specialTurnTime : settings.turnTime;
    
    setTimer(prev => ({
      ...prev,
      mode: newMode,
      currentTime: newTime,
      phase: 'turn',
      isRunning: false,
      isFinished: false,
      currentWord: 1
    }));
  };

  const getButtonText = () => {
    if (timer.isFinished) return 'תור חדש';
    if (timer.mode === 'special') return 'תור מיוחד';
    if (timer.phase === 'turn') return 'תור';
    return 'ניחושים';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-4">
      {/* Mode Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMode}
        className="absolute top-4 left-4 text-primary hover:text-primary/80"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        {timer.mode === 'regular' ? 'תור מיוחד' : 'תור רגיל'}
      </Button>

      {/* Settings Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-4 right-4 text-primary hover:text-primary/80"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="absolute top-16 right-4 p-4 w-64 z-10">
          <h3 className="font-semibold mb-3">הגדרות זמן</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">זמן תור (שניות)</label>
              <input
                type="number"
                value={settings.turnTime}
                onChange={(e) => setSettings(prev => ({ ...prev, turnTime: parseInt(e.target.value) || 60 }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                min="10"
                max="300"
              />
            </div>
            <div>
              <label className="text-sm font-medium">זמן ניחושים (שניות)</label>
              <input
                type="number"
                value={settings.guessTime}
                onChange={(e) => setSettings(prev => ({ ...prev, guessTime: parseInt(e.target.value) || 30 }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                min="5"
                max="120"
              />
            </div>
            <div>
              <label className="text-sm font-medium">זמן תור מיוחד (שניות)</label>
              <input
                type="number"
                value={settings.specialTurnTime}
                onChange={(e) => setSettings(prev => ({ ...prev, specialTurnTime: parseInt(e.target.value) || 45 }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                min="10"
                max="300"
              />
            </div>
            <Button
              onClick={updateTimerToSettings}
              className="w-full mt-3"
              variant="outline"
            >
              עדכן
            </Button>
          </div>
        </Card>
      )}

      {/* Main Timer Display */}
      <div className="text-center">
        {/* Phase Indicator */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-primary">
            {timer.mode === 'special' 
              ? `מילה ${timer.currentWord}` 
              : timer.phase === 'turn' 
                ? 'תור הסבר' 
                : 'זמן ניחושים'
            }
          </span>
        </div>

        {/* Timer Display */}
        <div className={cn(
          "text-8xl font-bold mb-8 transition-colors duration-300",
          getTimerColor()
        )}>
          {formatTime(timer.currentTime)}
        </div>

        {/* Main Action Button */}
        <Button
          onClick={timer.isRunning ? pauseTimer : startTimer}
          size="lg"
          className="w-48 h-48 rounded-full text-3xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {timer.isRunning ? (
            <>
              <Pause className="w-12 h-12 mr-2" />
              השהה
            </>
          ) : (
            <>
              <Play className="w-12 h-12 mr-2" />
              {getButtonText()}
            </>
          )}
        </Button>

        {/* Reset and Next Word Buttons */}
        <div className="mt-6 flex gap-4 justify-center">
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-4"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            איפוס
          </Button>
          
          {timer.mode === 'special' && (
            <Button
              onClick={nextWord}
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-4"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              למילה הבאה
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AliasTimer;