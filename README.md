# OProgress

**A modern, framework-agnostic progress bar for Next.js and React, inspired by [bprogress](https://github.com/imskyleen/bprogress).**

OProgress is a lightweight progress bar that visually indicates loading states in web applications — commonly used to show a **smooth, animated progress bar** during **page transitions, data loading, or asynchronous operations**.

It is built on a **TypeScript engine** that follows modern best practices, is actively maintained, and ships first-class integrations for **React** and **Next.js** (both the **app** and **pages** directories).

## Why OProgress?

- **Engine-based architecture** — a framework-agnostic `@oprogress/core` engine that works anywhere, with React and Next.js integrations on top.
- **Multiple instances** — control one global bar or several isolated ones via `createProgressBar()`.
- **Trickle, pause, resume, indeterminate** — a full set of controls out of the box.
- **Router integration** — `useRouter` for the Next.js **app directory** with `@oprogress/next`.
- **Data attributes** — `data-force-progress`, `data-prevent-progress`, `data-disable-progress`, `data-ignore-prevent-default` for fine-grained control over which links start the bar.

## Packages

| Package | Description | Installation | Documentation |
| ------- | ----------- | ------------ | ------------- |
| **Core** | Framework-agnostic progress engine | `npm install @oprogress/core` | [Docs](/docs) |
| **React** | Progress bar component + hooks (`@oprogress/react`) | `npm install @oprogress/react` | [React Docs](/docs/frameworks/react) |
| **Next.js** | `OProgress` component + `useRouter` for the app directory | `npm install @oprogress/next` | [Next.js Docs](/docs/frameworks/nextjs) |

> `@oprogress/next` re-exports everything from `@oprogress/react`, which in turn re-exports everything from `@oprogress/core`. Install only what you need.

## Get Started

```bash
npm install @oprogress/next
```

```tsx
import { OProgress } from '@oprogress/next/app';

function Providers({ children }) {
  return (
    <>
      <OProgress height="4px" color="#29d" shallowRouting />
      {children}
    </>
  );
}
```

See the [official documentation](https://oprogress.oimmi.com/docs) for the full guide.

## Inspirations

OProgress is inspired by the excellent work done in:

- **[bprogress](https://github.com/imskyleen/bprogress)**
- **[NProgress](https://github.com/rstacruz/nprogress)**

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/programming-with-ia/oprogress/issues) or make a PR [here](https://github.com/programming-with-ia/oprogress).

## License

MIT