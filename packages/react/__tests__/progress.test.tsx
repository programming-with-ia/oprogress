import React from 'react';
import { render, act } from '@testing-library/react';
import { createProgressBar } from '../src/createProgressBar';
import { setupGlobalListeners, teardownGlobalListeners } from '../src/listeners';
import type { ProgressState } from '@oprogress/core';

function makeInstance() {
  return createProgressBar();
}

describe('createProgressBar', () => {
  it('exposes the engine reducers', () => {
    const instance = makeInstance();
    expect(typeof instance.start).toBe('function');
    expect(typeof instance.done).toBe('function');
    expect(typeof instance.pause).toBe('function');
    expect(typeof instance.resume).toBe('function');
  });

  it('starts the engine imperatively', () => {
    const instance = makeInstance();
    instance.start();
    expect(instance.engine.getState().isStarted).toBe(true);
    instance.done();
  });
});

describe('useProgress', () => {
  it('exposes reactive state and control reducers', () => {
    const instance = makeInstance();

    const Control = ({ onState }: { onState: (s: ProgressState) => void }) => {
      const [state, { start, done }] = instance.useProgress();
      onState(state);
      return (
        <div>
          <button onClick={() => start()}>Start</button>
          <button onClick={() => done()}>Done</button>
        </div>
      );
    };

    const states: ProgressState[] = [];
    const { getByText } = render(<Control onState={(s) => states.push(s)} />);

    expect(states[0].isStarted).toBe(false);

    act(() => {
      getByText('Start').click();
    });

    expect(states[states.length - 1].isStarted).toBe(true);
  });
});

describe('global click listeners', () => {
  afterEach(() => {
    teardownGlobalListeners();
  });

  it('does not start progress on hash-only link clicks', () => {
    window.history.replaceState({}, '', '/examples');
    const instance = setupProgressForClick();

    const href = new URL('/examples#test', window.location.href).href;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = 'hash link';
    document.body.appendChild(link);

    act(() => {
      link.click();
    });

    expect(instance.engine.getState().isStarted).toBe(false);
  });

  it('does not start progress when clicking the same hash link again', () => {
    window.history.replaceState({}, '', '/examples#test');
    const instance = setupProgressForClick();

    const href = new URL('/examples#test', window.location.href).href;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = 'hash link again';
    document.body.appendChild(link);

    act(() => {
      link.click();
    });

    expect(instance.engine.getState().isStarted).toBe(false);
  });

  it('does not start progress on same-path-link-hash-removed clicks', () => {
    window.history.replaceState({}, '', '/examples#test');
    const instance = setupProgressForClick();

    const href = new URL('/examples', window.location.href).href;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = 'no-hash link';
    document.body.appendChild(link);

    act(() => {
      link.click();
    });

    expect(instance.engine.getState().isStarted).toBe(false);
  });

  it('starts progress on a real navigation link', () => {
    window.history.replaceState({}, '', '/examples');
    const instance = setupProgressForClick();

    const href = new URL('/examples/dashboard', window.location.href).href;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = 'nav link';
    document.body.appendChild(link);

    act(() => {
      link.click();
    });

    expect(instance.engine.getState().isStarted).toBe(true);
  });

  it('ignores urlchange events that only change the hash', () => {
    window.history.replaceState({}, '', '/examples');
    const instance = setupProgressForClick();
    instance.start();
    expect(instance.engine.getState().isStarted).toBe(true);

    act(() => {
      window.dispatchEvent(
        new CustomEvent('urlchange', {
          detail: { url: '/examples#test', method: 'hashchange' },
        }),
      );
    });

    expect(instance.engine.getState().isStarted).toBe(true);
    instance.done();
  });

  it('completes progress on urlchange events that change the pathname', () => {
    jest.useFakeTimers();
    window.history.replaceState({}, '', '/examples');
    const instance = setupProgressForClick();
    instance.start();
    expect(instance.engine.getState().isStarted).toBe(true);

    act(() => {
      window.dispatchEvent(
        new CustomEvent('urlchange', {
          detail: { url: '/examples/dashboard', method: 'pushState' },
        }),
      );
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(instance.engine.getState().isStarted).toBe(false);
    jest.useRealTimers();
  });
});

function setupProgressForClick() {
  const instance = createProgressBar();
  setupGlobalListeners(instance);
  return instance;
}

describe('ProgressBar', () => {
  it('renders null when idle', () => {
    const instance = makeInstance();
    const { container } = render(<instance.ProgressBar />);
    expect(container.querySelector('.oprogress-container')).toBeNull();
  });

  it('renders a bar after starting', () => {
    const instance = makeInstance();

    const Harness = () => {
      const [, { start }] = instance.useProgress();
      return (
        <>
          <button onClick={() => start()}>Start</button>
          <instance.ProgressBar height="4px" color="#f00" />
        </>
      );
    };

    const { getByText, container } = render(<Harness />);
    act(() => {
      getByText('Start').click();
    });

    const bar = container.querySelector('.oprogress-bar');
    expect(bar).not.toBeNull();
    expect(bar).toHaveStyle({ background: '#f00', height: '4px' });
  });

  it('renders the indeterminate variant', () => {
    const instance = makeInstance();

    const Indet = () => {
      const [, { startIndeterminate }] = instance.useProgress();
      return (
        <>
          <button onClick={() => startIndeterminate()}>Indet</button>
          <instance.ProgressBar />
        </>
      );
    };

    const { getByText, container } = render(<Indet />);
    act(() => {
      getByText('Indet').click();
    });

    expect(
      container.querySelector('.oprogress-bar-indeterminate'),
    ).not.toBeNull();
  });
});