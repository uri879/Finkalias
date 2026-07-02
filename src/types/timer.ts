export type Phase = 'turn' | 'guess';
export type Mode = 'regular' | 'special';

export interface TimerState {
  isRunning: boolean;
  currentTime: number;
  phase: Phase;
  isFinished: boolean;
  mode: Mode;
  currentWord: number;
}

export interface TimerSettings {
  turnTime: number;
  guessTime: number;
  specialTurnTime: number;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  turnTime: 60,
  guessTime: 30,
  specialTurnTime: 45,
};
