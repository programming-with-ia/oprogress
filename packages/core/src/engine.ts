import { createEmittor } from 'emittor';
import type {
  ProgressState,
  ProgressReducers,
  ProgressOptions,
  ProgressEmittor,
} from './types';
import { clamp } from './utils';

const defaultSettings: Required<ProgressOptions> = {
  minimum: 0.08,
  maximum: 1,
  easing: 'linear',
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  trickleMax: 0.95,
  direction: 'ltr',
};

export function createProgressEngine(
  options?: Partial<ProgressOptions>,
): ProgressEmittor {
  const settings = { ...defaultSettings, ...options };
  let trickleTimeout: ReturnType<typeof setTimeout> | null = null;
  let startTimeout: ReturnType<typeof setTimeout> | null = null;

  const initialState: ProgressState = {
    status: null,
    isStarted: false,
    isIndeterminate: false,
    isPaused: false,
    options: settings,
  };

  const emittor = createEmittor<ProgressState, ProgressReducers>(initialState, {
    reducerFactory: (em) => {
      const clearTimers = () => {
        if (trickleTimeout) clearTimeout(trickleTimeout);
        if (startTimeout) clearTimeout(startTimeout);
      };

      const doDone = (force?: boolean) => {
        clearTimers();
        const state = em.getState();
        if (!force && state.status === null) return;

        em.setState({ ...state, status: 1 });
        
        setTimeout(() => {
          em.setState({
            ...em.getState(),
            status: null,
            isStarted: false,
            isPaused: false,
          });
        }, state.options.speed || 200);
      };

      const doSet = (n: number) => {
        clearTimers();
        const state = em.getState();
        const clamped = clamp(n, state.options.minimum!, state.options.maximum!);
        
        if (clamped >= state.options.maximum!) {
          em.setState({ ...state, status: clamped });
          doDone();
          return;
        }

        em.setState({
          ...state,
          isStarted: true,
          status: clamped,
        });
      };

      const doStart = (startPosition = 0, delay = 0) => {
        clearTimers();
        const startLogic = () => {
          const state = em.getState();
          if (state.status !== null) {
            if (state.options.trickle) {
              trickleTimeout = setTimeout(doTrickle, state.options.trickleSpeed);
            }
            return;
          }
          em.setState({
            ...state,
            isStarted: true,
            status: clamp(startPosition || state.options.minimum!, state.options.minimum!, state.options.maximum!),
          });
          if (state.options.trickle) {
            trickleTimeout = setTimeout(doTrickle, state.options.trickleSpeed);
          }
        };

        if (delay > 0) {
          startTimeout = setTimeout(startLogic, delay);
        } else {
          startLogic();
        }
      };

      const doInc = (amount?: number) => {
        const state = em.getState();
        if (state.isPaused) return;

        const n = state.status;
        if (n === null) {
          doStart();
          return;
        }
        if (n > 1) return;

        if (typeof amount !== 'number') {
          if (n >= 0 && n < 0.2) amount = 0.1;
          else if (n >= 0.2 && n < 0.5) amount = 0.04;
          else if (n >= 0.5 && n < 0.8) amount = 0.02;
          else if (n >= 0.8 && n < 0.99) amount = 0.005;
          else amount = 0;
        }
        doSet(clamp(n + amount, 0, state.options.trickleMax!));
      };

      const doTrickle = () => {
        const state = em.getState();
        if (state.isPaused || state.status === null) return;
        doInc();
        trickleTimeout = setTimeout(doTrickle, state.options.trickleSpeed);
      };

      return {
        start: doStart,
        set: doSet,
        inc: doInc,
        dec: (amount?: number) => {
          const state = em.getState();
          if (state.isPaused) return;

          const n = state.status;
          if (n === null) return;

          if (typeof amount !== 'number') {
            if (n > 0.8) amount = 0.1;
            else if (n > 0.5) amount = 0.05;
            else if (n > 0.2) amount = 0.02;
            else amount = 0.01;
          }
          doSet(clamp(n - amount, 0, state.options.trickleMax!));
        },
        trickle: doInc,
        done: doDone,
        stop: () => {
          clearTimers();
          const state = em.getState();
          em.setState({
            ...state,
            status: null,
            isStarted: false,
            isIndeterminate: false,
            isPaused: false,
          });
        },
        startIndeterminate: () => {
          const state = em.getState();
          em.setState({
            ...state,
            isIndeterminate: true,
          });
        },
        stopIndeterminate: () => {
          const state = em.getState();
          em.setState({
            ...state,
            isIndeterminate: false,
          });
        },
        pause: () => {
          const state = em.getState();
          if (state.isPaused) return;
          clearTimers();
          em.setState({ ...state, isPaused: true });
        },
        resume: () => {
          const state = em.getState();
          if (!state.isPaused) return;
          em.setState({ ...state, isPaused: false });
          if (state.status !== null && state.options.trickle) {
            trickleTimeout = setTimeout(doTrickle, state.options.trickleSpeed);
          }
        },
      };
    },
  });

  return emittor;
}
