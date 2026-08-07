'use client';

import { useRouter } from '@oprogress/next/app';
import { useProgress } from '@oprogress/react';
import { Button } from '@workspace/ui/components/ui/button';
import Link from 'next/link';
import { useRouter as useNextRouter } from 'next/navigation';
import {
  containerProgress,
  doneContainerProgress,
  startContainerIndeterminate,
  startContainerProgress,
  stopContainerIndeterminate,
  stopContainerProgress,
} from './demo-providers';

export default function Home() {
  const router = useRouter();
  const nextRouter = useNextRouter();
  const [
    state,
    { start, stop, pause, resume, startIndeterminate, stopIndeterminate, done },
  ] = useProgress();

  return (
    <>
      <h1 className="text-4xl font-bold">OProgress Examples</h1>
      <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl">
        Interactive demo of the global progress bar and a scoped container
        progress bar. Try the buttons and watch the bar at the top of the page.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Global Progress
        </h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => start()}>Start</Button>
          <Button onClick={() => stop()} variant="outline">
            Stop
          </Button>
          <Button onClick={startIndeterminate} variant="secondary">
            Start Indeterminate
          </Button>
          <Button onClick={stopIndeterminate} variant="outline">
            Stop Indeterminate
          </Button>
          <Button onClick={() => done()} variant="secondary">
            Done
          </Button>
          <Button onClick={pause} variant="outline">
            Pause
          </Button>
          <Button onClick={resume} variant="outline">
            Resume
          </Button>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Global progress active: {state.isStarted ? 'Yes' : 'No'}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Container Progress
        </h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={startContainerProgress}>Start</Button>
          <Button onClick={stopContainerProgress} variant="outline">
            Stop
          </Button>
          <Button onClick={doneContainerProgress} variant="secondary">
            Done
          </Button>
          <Button onClick={startContainerIndeterminate} variant="secondary">
            Start Indeterminate
          </Button>
          <Button onClick={stopContainerIndeterminate} variant="outline">
            Stop Indeterminate
          </Button>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Operates on the bar inside the &quot;Container Progress Demo&quot;
          box below.
        </p>
        <div className="relative overflow-hidden rounded-lg bg-neutral-100 h-10 border border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700">
          <containerProgress.ProgressBar
            target="container"
            position="bottom"
            height="4px"
            color="blue"
          />
          <div className="p-2 text-sm text-gray-500">Container Progress Demo</div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Navigation
        </h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => router.push('/examples/dashboard')}>
            router.push(&apos;/examples/dashboard&apos;)
          </Button>
          <Button
            title="use useRouter from 'next/navigation'"
            data-force-progress="true"
            onClick={() => nextRouter.push('/examples/dashboard')}
            variant="secondary"
          >
            Force progress (data-force-progress)
          </Button>
          <Button onClick={() => router.back()} variant="outline">
            Back
          </Button>
          <Button onClick={() => router.forward()} variant="outline">
            Forward
          </Button>
          <Button onClick={() => router.refresh()} variant="outline">
            Refresh
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
            Same route link
          </Link>
          <Link
            href="/examples?test=param"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Shallow URL params
          </Link>
          <Link
            href="/examples/dashboard"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Dashboard link
          </Link>
          <Link
            href="#test"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Link with hash (no progress)
          </Link>
          <Link
            href="/examples/dashboard"
            data-prevent-progress="true"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Link with data-prevent-progress
          </Link>
        </div>
      </section>
    </>
  );
}
