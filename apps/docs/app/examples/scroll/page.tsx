'use client';

import { useEffect } from 'react';
import { createProgressBar } from '@oprogress/react';

const scrollProgress = createProgressBar({
  trickle: false,
  speed: 100,
  minimum: 0,
  maximum: 1,
});

const ScrollProgress = () => {
  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      if (total <= 0) {
        scrollProgress.stop();
        return;
      }
      scrollProgress.set(Math.min(scrollTop / total, 0.999));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Scroll Progress</h1>
      <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl">
        This page uses a custom progress bar at the bottom that reflects your
        scroll position. Scroll down to see the bar fill up to 100%.
      </p>

      <scrollProgress.ProgressBar
        position="bottom"
        className="scroll-progress"
        height="4px"
        color="#f97316"
      />

      <div className="flex flex-col gap-6 py-8">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="rounded-lg bg-neutral-100 border border-neutral-300 p-6 dark:bg-neutral-800 dark:border-neutral-700"
          >
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
              Section {i + 1}
            </h2>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Keep scrolling to watch the bottom progress bar fill up. It is
              driven by your scroll position and caps just below 100% until you
              reach the very bottom of the page.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollProgress;