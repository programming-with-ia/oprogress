'use client';

import Link from 'next/link';
import { Button } from '@workspace/ui/components/ui/button';
import { useProgress } from '@oprogress/react';
import { useRouter } from '@oprogress/next/app';

export default function LinkTesting() {
  const router = useRouter();
  const [, { start, stop }] = useProgress();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-4xl font-bold">Link Testing</h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl">
          Matrix of links, buttons, and attributes to verify exactly when the
          progress bar starts and when it is suppressed.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Global controls
        </h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => start()}>Start progress</Button>
          <Button onClick={() => stop()} variant="outline">
            Stop progress
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Links
        </h2>
        <div className="flex flex-col gap-2">
          <Link
            href="/examples"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Same route
          </Link>
          <Link
            href="/examples?test=param"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Shallow
          </Link>
          <Link
            href="/examples/dashboard"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Dashboard
          </Link>
          <Link
            href="/examples/dashboard"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex flex-col"
          >
            <span>Dashboard</span>
            <span
              onClick={(e) => e.preventDefault()}
              data-prevent-progress={true}
            >
              e.preventDefault()
            </span>
          </Link>
          <Link href="#test" className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Link with href
          </Link>
          <Link
            href="/examples/dashboard"
            data-disable-progress={true}
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Link with oprogress disabled
          </Link>
          <Link
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            href="https://www.npmjs.com/package/@oprogress/react"
            target="_blank"
            rel="noopener noreferrer"
          >
            Link with target=&quot;_blank&quot; not affected
          </Link>
          <Link
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            href="mailto:john.doe@example.com"
            rel="noopener noreferrer"
          >
            Link with mailto not affected
          </Link>
          <Link
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            href="tel:0000000000"
            rel="noopener noreferrer"
          >
            Link with tel not affected
          </Link>
          <Link
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            href="blob:http://localhost:3000/123456789"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Link with blob not affected
          </Link>
          <a className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer">
            Link without href won&apos;t throw error
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Router methods
        </h2>
        <div className="flex flex-col gap-2">
          <Button onClick={() => router.push('/examples')}>
            Push same url
          </Button>
          <Button onClick={() => router.push('/examples/dashboard')}>
            Push Dashboard
          </Button>
          <Button onClick={() => router.refresh()} variant="outline">
            Refresh
          </Button>
          <Button
            onClick={() =>
              router.push('/examples/dashboard', {
                showProgress: true,
              })
            }
          >
            Push with showProgress true
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.replace('/examples/dashboard')}
          >
            Replace Dashboard
          </Button>
          <Button onClick={() => router.push('/examples?test=param')}>
            Push with param
          </Button>
          <Button
            onClick={() => router.push('/examples/dashboard')}
            variant="outline"
          >
            Push Dashboard without progress bar (use Next.js router)
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Inside an SVG element
        </h2>
        <svg className="h-24 w-24 text-neutral-500">
          <Link href="/examples/dashboard">
            <circle cx={48} cy={48} r={48} className="fill-current" />
          </Link>
        </svg>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Links inside SVGs do not trigger the progress bar.
        </p>
      </section>
    </div>
  );
}