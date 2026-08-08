import { motion } from 'framer-motion';

import { Highlight } from '@workspace/ui/components/ui/hero-highlight';
import { Button } from '@workspace/ui/components/ui/button';
import {
  ArrowRightIcon,
  FlaskConical,
  PlayCircle,
  StopCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useProgress } from '@oprogress/react';

export const Hero = () => {
  const [, { start, stop }] = useProgress();

  return (
    <div className="relative z-20 mx-auto max-w-7xl px-6 lg:pt-20 pt-32 w-full flex items-center justify-center">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="lg:max-w-[60%] max-w-[700px] lg:space-y-8 space-y-6 flex flex-col items-center justify-center"
      >
        <span className="oprogress-logo fade" />

        <h1 className="text-3xl md:text-4xl lg:text-[46px] font-semibold text-neutral-800 dark:text-white !leading-relaxed lg:!leading-snug text-center">
          Improve page transitions with a smooth{' '}
          <Highlight>progress bar</Highlight>
        </h1>

        <p className="lg:text-lg text-base text-neutral-500 dark:text-neutral-400 max-w-2xl text-center">
          <strong>OProgress</strong> is an upgraded version of{' '}
          <strong>NProgress</strong>, inspired by{' '}
          <a
            className="underline"
            href="https://github.com/imskyleen/bprogress"
            target="_blank"
            rel="noreferrer"
          >
            bprogress
          </a>
          , offering a more modern design and enhanced features for a smoother
          experience.
        </p>

        <div className="flex lg:flex-row flex-col lg:gap-5 gap-3 items-center">
          <Button
            size="lg"
            className="w-fit rounded-full pr-5 bg-blue-500 hover:bg-blue-500/90 text-white"
            asChild
          >
            <Link href="/docs">
              Get Started <ArrowRightIcon className="!size-5" />
            </Link>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-fit rounded-full pr-5"
            asChild
          >
            <Link href="/examples">
              Test it out <FlaskConical className="!size-5" />
            </Link>
          </Button>
        </div>

        <div className="lg:!mt-16 !mt-10 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-semibold">Try it now !</h2>
          <div className="flex flex-row gap-x-3">
            <Button size="icon-lg" onClick={() => start()}>
              <PlayCircle className="!size-7" />
            </Button>

            <Button size="icon-lg" onClick={() => stop()}>
              <StopCircle className="!size-7" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
