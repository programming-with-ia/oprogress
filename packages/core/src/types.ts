import type { Emittor } from 'emittor';
export interface ProgressOptions {
  minimum?: number;
  maximum?: number;
  easing?: string;
  speed?: number;
  trickle?: boolean;
  trickleSpeed?: number;
  trickleMax?: number;
  direction?: 'ltr' | 'rtl';
}

export interface ProgressState {
  status: number | null;
  isStarted: boolean;
  isIndeterminate: boolean;
  isPaused: boolean;
  options: ProgressOptions;
}

export type ProgressReducers = {
  start: (startPosition?: number, delay?: number) => void;
  set: (n: number) => void;
  inc: (amount?: number) => void;
  dec: (amount?: number) => void;
  trickle: () => void;
  done: (force?: boolean) => void;
  stop: () => void;
  startIndeterminate: () => void;
  stopIndeterminate: () => void;
  pause: () => void;
  resume: () => void;
};

export type ProgressEmittor = Emittor<ProgressState, ProgressReducers>;

export interface CreateProgressEngineOptions extends ProgressOptions {}
