import { createProgressEngine } from '@oprogress/core';
import type { ProgressOptions, ProgressEmittor, ProgressState, ProgressReducers } from '@oprogress/core';
import { useEmittor } from 'emittor';
import React from 'react';
import { createProgressBarComponent, type ProgressBarProps } from './ProgressBar';

export type ProgressBarInstance = ProgressReducers & {
  engine: ProgressEmittor;
  useProgress: () => [ProgressState, ProgressReducers];
  ProgressBar: React.ComponentType<ProgressBarProps>;
};

export function createProgressBar(options?: Partial<ProgressOptions>): ProgressBarInstance {
  const engine = createProgressEngine(options);

  const useProgress = (): [ProgressState, ProgressReducers] => {
    const [state] = useEmittor(engine);
    return [state, engine.reducers];
  };

  const ProgressBar = createProgressBarComponent(useProgress);

  return {
    engine,
    useProgress,
    ProgressBar,
    start: engine.reducers.start,
    set: engine.reducers.set,
    inc: engine.reducers.inc,
    dec: engine.reducers.dec,
    trickle: engine.reducers.trickle,
    done: engine.reducers.done,
    stop: engine.reducers.stop,
    startIndeterminate: engine.reducers.startIndeterminate,
    stopIndeterminate: engine.reducers.stopIndeterminate,
    pause: engine.reducers.pause,
    resume: engine.reducers.resume,
  };
}
