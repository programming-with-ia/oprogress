# OProgress Core

**The framework-agnostic progress engine behind OProgress, inspired by [oprogress](https://github.com/programming-with-ia/oprogress).**

The `@oprogress/core` package is the framework-agnostic engine that powers OProgress. It provides a **stateful singleton-style progress engine** built on top of `emittor`, along with a set of typed utilities.

> This package is a dependency of [`@oprogress/react`](https://www.npmjs.com/package/@oprogress/react). For React and Next.js, you usually only need `@oprogress/react`.

## Installation

```bash
npm install @oprogress/core
```

## Usage

Create a progress engine and control it imperatively:

```ts
import { createProgressEngine } from '@oprogress/core';

const engine = createProgressEngine({
  minimum: 0.08,
  maximum: 1,
  speed: 200,
  trickle: true,
});

engine.start();
engine.done();
```

Subscribe to its reactive state:

```ts
const disconnect = engine.connect((state) => {
  console.log(state.status, state.isStarted);
});
```

### Configuring a persistent instance

If you configure options once and reuse them everywhere, export a dedicated module:

```ts
// lib/progress.ts
import { createProgressEngine } from '@oprogress/core';

export const progress = createProgressEngine({ speed: 250 });
```

Then import `progress` wherever you need to start/stop the bar.

## Api

### `createProgressEngine(options?)`

Creates a progress engine instance.

| Options        | Type           | Default   | Description                                   |
| -------------- | -------------- | --------- | --------------------------------------------- |
| `minimum`     | number         | `0.08`    | The minimum percentage value between 0 and 1. |
| `maximum`     | number         | `1`       | The maximum percentage value between 0 and 1. |
| `easing`       | string         | `'linear'`| The CSS easing of the progress bar.           |
| `speed`        | number         | `200`     | The CSS transition speed of the progress bar. |
| `trickle`      | boolean        | `true`    | Auto-increment the progress bar while started.|
| `trickleSpeed` | number         | `200`     | The trickle interval in `ms`.                 |
| `direction`    | `'ltr' \| 'rtl'` | `'ltr'` | The layout direction of the progress bar.    |

### Engine methods

Each returned engine exposes the following methods:

| Method               | Signature                                            | Description                                                      |
| -------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| `start`              | `(startPosition?, delay?) => void`                    | Starts the progress bar.                                         |
| `set`                | `(n: number) => void`                                 | Sets the progress bar to a percentage (0-1).                     |
| `inc`                | `(amount?: number) => void`                           | Increments the progress bar.                                     |
| `dec`                | `(amount?: number) => void`                           | Decrements the progress bar.                                     |
| `trickle`            | `() => void`                                          | Applies a small increment (used internally).                     |
| `done`               | `(force?: boolean) => void`                           | Completes and hides the progress bar.                            |
| `stop`               | `() => void`                                          | Stops and hides the progress bar without completing it.          |
| `startIndeterminate` | `() => void`                                          | Enables indeterminate (sliding) mode.                            |
| `stopIndeterminate`  | `() => void`                                          | Disables indeterminate mode.                                     |
| `pause`              | `() => void`                                          | Pauses automatic progression.                                    |
| `resume`             | `() => void`                                          | Resumes automatic progression.                                   |

### State

The engine keeps a `ProgressState`:

```ts
interface ProgressState {
  status: number | null;
  isStarted: boolean;
  isIndeterminate: boolean;
  isPaused: boolean;
  options: ProgressOptions;
}
```

## Utils

`@oprogress/core` also exports a few lightweight utilities:

- `clamp(n, min, max)`
- `toBarPerc(n, direction)`
- `toCss(element, properties)` / `toCss(element, name, value)`
- `addClass(element, name)` / `removeClass(element, name)`
- `removeElement(element)`
- `isSameURL(target, current)` / `isSameURLWithoutSearch(target, current)`
- `observeUrl(cb)` – observe URL changes (also available from `window-change-events/url`).

## Documentation

Go to the [documentation](https://oprogress.oimmi.com/docs) to learn more about OProgress.

## Inspirations

OProgress is inspired by the excellent work done in:

- **[oprogress](https://github.com/programming-with-ia/oprogress)**
- **[NProgress](https://github.com/rstacruz/nprogress)**

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/programming-with-ia/oprogress/issues) or make a PR [here](https://github.com/programming-with-ia/oprogress).

## License

MIT