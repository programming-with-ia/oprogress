import { createProgressEngine } from '../src/engine';
import { isSameURL, isSameURLWithoutSearch } from '../src/lib/same-url';
import { clamp } from '../src/utils/clamp';

describe('createProgressEngine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the required reducer methods', () => {
    const engine = createProgressEngine();
    expect(typeof engine.reducers.start).toBe('function');
    expect(typeof engine.reducers.set).toBe('function');
    expect(typeof engine.reducers.inc).toBe('function');
    expect(typeof engine.reducers.dec).toBe('function');
    expect(typeof engine.reducers.trickle).toBe('function');
    expect(typeof engine.reducers.done).toBe('function');
    expect(typeof engine.reducers.stop).toBe('function');
    expect(typeof engine.reducers.pause).toBe('function');
    expect(typeof engine.reducers.resume).toBe('function');
    expect(typeof engine.reducers.startIndeterminate).toBe('function');
    expect(typeof engine.reducers.stopIndeterminate).toBe('function');
  });

  it('initializes with default options', () => {
    const engine = createProgressEngine();
    const state = engine.getState();
    expect(state.status).toBeNull();
    expect(state.isStarted).toBe(false);
    expect(state.isIndeterminate).toBe(false);
    expect(state.isPaused).toBe(false);
    expect(state.options.minimum).toBe(0.08);
    expect(state.options.maximum).toBe(1);
  });

  it('merges provided options with defaults', () => {
    const engine = createProgressEngine({ minimum: 0.2, speed: 300 });
    const state = engine.getState();
    expect(state.options.minimum).toBe(0.2);
    expect(state.options.speed).toBe(300);
    expect(state.options.maximum).toBe(1);
  });

  it('start() sets isStarted and a status at minimum', () => {
    const engine = createProgressEngine();
    engine.reducers.start();
    const state = engine.getState();
    expect(state.isStarted).toBe(true);
    expect(state.status).toBe(state.options.minimum);
  });

  it('start() with a startPosition uses it', () => {
    const engine = createProgressEngine();
    engine.reducers.start(0.5);
    expect(engine.getState().status).toBe(0.5);
  });

  it('start() with a delay waits before starting', () => {
    const engine = createProgressEngine();
    engine.reducers.start(0, 100);
    expect(engine.getState().isStarted).toBe(false);
    jest.advanceTimersByTime(100);
    expect(engine.getState().isStarted).toBe(true);
  });

  it('set() respects minimum and maximum', () => {
    const engine = createProgressEngine();
    engine.reducers.set(1.5);
    expect(engine.getState().status).toBe(1);
    engine.reducers.set(-1);
    expect(engine.getState().status).toBe(0.08);
  });

  it('done() keeps status at 1 then resets after speed', () => {
    const engine = createProgressEngine();
    engine.reducers.start();
    engine.reducers.done();
    expect(engine.getState().status).toBe(1);
    jest.advanceTimersByTime(engine.getState().options.speed! + 10);
    expect(engine.getState().status).toBeNull();
    expect(engine.getState().isStarted).toBe(false);
  });

  it('done() with force completes even when not started', () => {
    const engine = createProgressEngine();
    engine.reducers.done(true);
    expect(engine.getState().status).toBe(1);
  });

  it('stop() hides the bar without completing', () => {
    const engine = createProgressEngine();
    engine.reducers.start();
    engine.state.status = 0.5;
    engine.reducers.stop();
    const state = engine.getState();
    expect(state.status).toBeNull();
    expect(state.isStarted).toBe(false);
  });

  it('inc() increments the status', () => {
    const engine = createProgressEngine();
    engine.reducers.start(0.2);
    const before = engine.getState().status!;
    engine.reducers.inc();
    expect(engine.getState().status!).toBeGreaterThan(before);
  });

  it('dec() decrements the status', () => {
    const engine = createProgressEngine();
    engine.reducers.set(0.5);
    const before = engine.getState().status!;
    engine.reducers.dec();
    expect(engine.getState().status!).toBeLessThan(before);
  });

  it('trickle keeps progressing while started', () => {
    const engine = createProgressEngine();
    engine.reducers.start();
    jest.advanceTimersByTime(200 * 5);
    expect(engine.getState().status).toBeGreaterThan(0);
  });

  it('trickle never exceeds trickleMax', () => {
    const engine = createProgressEngine();
    engine.reducers.start(0.5);
    jest.advanceTimersByTime(200 * 1000);
    const status = engine.getState().status!;
    expect(status).toBeLessThanOrEqual(engine.getState().options.trickleMax!);
  });

  it('trickleMax is configurable', () => {
    const engine = createProgressEngine({ trickleMax: 0.9 });
    engine.reducers.start(0.85);
    jest.advanceTimersByTime(200 * 1000);
    expect(engine.getState().status).toBeLessThanOrEqual(0.9);
  });

  it('pause() halts trickle and resume() restarts it', () => {
    const engine = createProgressEngine();
    engine.reducers.start();
    engine.reducers.pause();
    expect(engine.getState().isPaused).toBe(true);
    const paused = engine.getState().status;
    jest.advanceTimersByTime(500);
    expect(engine.getState().status).toBe(paused);
    engine.reducers.resume();
    jest.advanceTimersByTime(500);
    expect(engine.getState().status).not.toBe(paused);
  });

  it('startIndeterminate / stopIndeterminate toggle the flag', () => {
    const engine = createProgressEngine();
    engine.reducers.startIndeterminate();
    expect(engine.getState().isIndeterminate).toBe(true);
    engine.reducers.stopIndeterminate();
    expect(engine.getState().isIndeterminate).toBe(false);
  });
});

describe('isSameURL', () => {
  it('returns true for identical URLs', () => {
    const a = new URL('https://example.com/foo?bar=1');
    const b = new URL('https://example.com/foo?bar=1');
    expect(isSameURL(a, b)).toBe(true);
  });

  it('returns false when the query differs', () => {
    const a = new URL('https://example.com/foo?bar=1');
    const b = new URL('https://example.com/foo?bar=2');
    expect(isSameURL(a, b)).toBe(false);
  });

  it('ignores search when using isSameURLWithoutSearch', () => {
    const a = new URL('https://example.com/foo?bar=1');
    const b = new URL('https://example.com/foo?bar=2');
    expect(isSameURLWithoutSearch(a, b)).toBe(true);
  });
});

describe('clamp', () => {
  it('clamps to min and max', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(0, 1, 10)).toBe(1);
    expect(clamp(15, 1, 10)).toBe(10);
  });
});