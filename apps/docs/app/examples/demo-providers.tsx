'use client';

import Link from 'next/link';
import { OProgress, createProgressBar } from '@oprogress/react';

export const containerProgress = createProgressBar({ speed: 400 });

export const startContainerIndeterminate = () =>
  containerProgress.startIndeterminate();
export const stopContainerIndeterminate = () =>
  containerProgress.stopIndeterminate();
export const startContainerProgress = () => containerProgress.start();
export const stopContainerProgress = () => containerProgress.stop();
export const doneContainerProgress = () => containerProgress.done();

const DemoProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OProgress height="4px" color="currentColor" shallowRouting={false} />

      <div className="min-h-screen bg-background p-6">
        <nav className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/examples"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Home
          </Link>
          <Link
            href="/examples/dashboard"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Dashboard
          </Link>
          <Link
            href="/examples/link-testing"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Link testing
          </Link>
          <Link
            href="/examples/mounted"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Mounted
          </Link>
          <Link
            href="/examples/load"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Load (5s)
          </Link>
          <Link
            href="/examples/scroll"
            className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Scroll
          </Link>
        </nav>

        <main className="flex flex-col gap-6">{children}</main>
      </div>
    </>
  );
};

export default DemoProviders;
