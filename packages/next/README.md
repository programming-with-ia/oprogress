# OProgress for Next.js

**A progress bar for Next.js, inspired by [oprogress](https://github.com/programming-with-ia/oprogress).**

OProgress integration on Next.js, compatible with the **/app** and **/pages** directories. This package re-exports everything from `@oprogress/react` and `@oprogress/core`, and additionally provides the `useRouter` hook for the **app directory** router.

## Installation

To install OProgress, run the following command:

```bash
npm install @oprogress/next
```

`@oprogress/next` is the only package you need for the out-of-the-box progress bar and the `useRouter` hook for the **app directory** router.

## Quick Start

Import `OProgress` into your layout and it will automatically start when the user navigates between pages.

### App directory

Add it to `/app/layout.tsx` (inside a `'use client'` file):

```tsx
// app/providers.tsx
'use client';

import { OProgress } from '@oprogress/next';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OProgress height="4px" color="#29d" shallowRouting />
      {children}
    </>
  );
}
```

Then wrap your application in `/app/layout.tsx`:

```tsx
// app/layout.tsx
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### Pages directory

Add it to `/pages/_app.tsx`:

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { OProgress } from '@oprogress/next';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <OProgress height="4px" color="#fffd00" shallowRouting />
      <Component {...pageProps} />
    </>
  );
}
```

## useRouter (app directory)

The `useRouter` hook extends the Next.js router to start and stop the progress bar on programmatic navigation.

```tsx
import { useRouter } from '@oprogress/next/app';

function Navigation() {
  const router = useRouter();
  return <button onClick={() => router.push('/about')}>About</button>;
}
```

## Documentation

Go to the [official documentation](https://oprogress.oimmi.com/docs) to learn more about OProgress.

## Inspirations

OProgress is inspired by the excellent work done in:

- **[oprogress](https://github.com/programming-with-ia/oprogress)**
- **[NProgress](https://github.com/rstacruz/nprogress)**

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/programming-with-ia/oprogress/issues) or make a PR [here](https://github.com/programming-with-ia/oprogress).

## License

MIT