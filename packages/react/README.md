# OProgress for React

**A progress bar for React, inspired by [bprogress](https://github.com/imskyleen/bprogress).**

`@oprogress/react` provides the `OProgress` component and hooks on top of the framework-agnostic [`@oprogress/core`](https://www.npmjs.com/package/@oprogress/core) engine.

> This package re-exports everything from `@oprogress/core`, so you can use the engine API without installing it separately.

## Installation

```bash
npm install @oprogress/react
```

## Usage

Add `OProgress` to your layout:

```tsx
import { OProgress } from '@oprogress/react';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OProgress height="4px" color="#fffd00" shallowRouting />
      {children}
    </>
  );
}
```

Control the bar imperatively with the `useProgress` hook or the shared `progress` instance:

```tsx
import { useProgress, progress } from '@oprogress/react';

function Controls() {
  const [state, { start, stop, pause, resume }] = useProgress();

  return (
    <div>
      <p>Progress Active: {state.isStarted ? 'Yes' : 'No'}</p>

      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>

      {/* Or control directly using the progress instance! */}
      <button onClick={() => progress.start()}>Start (Direct)</button>
      <button onClick={() => progress.stop()}>Stop (Direct)</button>
    </div>
  );
}
```

## Multiple instances

Create an isolated progress bar with `createProgressBar()` for scoped/container progress bars.

## Next.js

For Next.js, install [`@oprogress/next`](https://www.npmjs.com/package/@oprogress/next) to also get the `useRouter` hook for the **app directory** router.

## Documentation

Go to the [official documentation](https://oprogress.oimmi.com/docs) to learn more about OProgress.

## Inspirations

OProgress is inspired by the excellent work done in:

- **[bprogress](https://github.com/imskyleen/bprogress)**
- **[NProgress](https://github.com/rstacruz/nprogress)**

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/programming-with-ia/oprogress/issues) or make a PR [here](https://github.com/programming-with-ia/oprogress).

## License

MIT