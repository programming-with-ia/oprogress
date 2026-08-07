/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AppRouterProgressInstance,
  InferPrefetchOptions,
  InferRouterOptions,
  RouterActionsProgressOptions,
} from '../types';
import { useRouter as useNextRouter } from 'next/navigation.js';
import { useRef } from 'react';
import { isSameURL } from '@oprogress/core';
import { AppRouterInstance as NextAppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useProgress } from '@oprogress/react';

/**
 * Custom hook that extends the Next.js router with progress bar functionality.
 *
 * @param options Progress bar options.
 * @returns An extended router with push, replace, prefetch, back, refresh, and forward methods that manage the progress bar.
 */
export function useRouter<
  ROpts = InferRouterOptions<NextAppRouterInstance>,
  POpts = InferPrefetchOptions<NextAppRouterInstance>,
>(
  options?: RouterActionsProgressOptions,
): AppRouterProgressInstance<ROpts, POpts> {
  const defaultProgressOptions = options || {};
  const router: NextAppRouterInstance = useNextRouter();
  const [, reducers] = useProgress();
  const { start, stop } = reducers;

  // Using a ref to keep a stable reference of the extended router.
  const extendedRouterRef = useRef<AppRouterProgressInstance<
    ROpts,
    POpts
  > | null>(null);

  /**
   * Generic function to create a handler for methods that require an href (push, replace).
   * It extracts the progress options and passes the rest as router-specific options.
   */
  function createHandler<Fn extends (href: string, opts?: any) => void>(
    fn: Fn,
  ) {
    return (href: string, options?: any): void => {
      const {
        showProgress,
        startPosition,
        delay,
        stopDelay,
        ...routerOpts
      } = options || {};
      const progressOpts = {
        ...defaultProgressOptions,
        showProgress,
        startPosition,
        delay,
        stopDelay,
      };

      const force = progressOpts.showProgress === true;
      const localStartPosition =
        progressOpts.startPosition !== undefined
          ? progressOpts.startPosition
          : undefined;
      const localDelay =
        progressOpts.delay !== undefined ? progressOpts.delay : undefined;
      const localStopDelay =
        progressOpts.stopDelay !== undefined
          ? progressOpts.stopDelay
          : undefined;

      const targetUrl = new URL(href, location.href);
      const sameURL = isSameURL(targetUrl, new URL(location.href));

      if (sameURL && !force) {
        return fn(href, routerOpts);
      }

      start(localStartPosition, localDelay);

      setTimeout(() => {
        if (sameURL) {
          if (localStopDelay !== undefined && localStopDelay > 0) {
            setTimeout(() => stop(), localStopDelay);
          } else {
            stop();
          }
        }
      }, localDelay || 0);

      return fn(href, routerOpts);
    };
  }

  /**
   * Handler for methods that do not require an href (back, refresh, forward).
   */
  function createNoHrefHandler<Fn extends (opts?: any) => void>(fn: Fn) {
    return (options?: any): void => {
      const {
        showProgress,
        startPosition,
        delay,
        stopDelay,
        ...routerOpts
      } = options || {};
      const progressOpts = {
        ...defaultProgressOptions,
        showProgress,
        startPosition,
        delay,
        stopDelay,
      };

      const force = progressOpts.showProgress === true;
      const localStartPosition =
        progressOpts.startPosition !== undefined
          ? progressOpts.startPosition
          : undefined;
      const localDelay =
        progressOpts.delay !== undefined ? progressOpts.delay : undefined;
      const localStopDelay =
        progressOpts.stopDelay !== undefined
          ? progressOpts.stopDelay
          : undefined;

      if (force) {
        start(localStartPosition, localDelay);
      }

      const result = fn(routerOpts);

      setTimeout(() => {
        if (localStopDelay !== undefined && localStopDelay > 0) {
          setTimeout(() => stop(), localStopDelay);
        } else {
          stop();
        }
      }, localDelay || 0);

      return result;
    };
  }

  /**
   * Handler for the prefetch method.
   */
  function createPrefetchHandler<Fn extends (href: string, opts?: any) => void>(
    fn: Fn,
  ) {
    return (href: string, options?: POpts): void => {
      return fn(href, options);
    };
  }

  if (!extendedRouterRef.current) {
    extendedRouterRef.current = {
      ...router,
      push: createHandler(router.push),
      replace: createHandler(router.replace),
      prefetch: createPrefetchHandler(router.prefetch),
      back: createNoHrefHandler(router.back),
      refresh: createNoHrefHandler(router.refresh),
      forward: createNoHrefHandler(router.forward),
    } as AppRouterProgressInstance<ROpts, POpts>;
  } else {
    extendedRouterRef.current.push = createHandler(router.push);
    extendedRouterRef.current.replace = createHandler(router.replace);
    extendedRouterRef.current.prefetch = createPrefetchHandler(router.prefetch);
    extendedRouterRef.current.back = createNoHrefHandler(router.back);
    extendedRouterRef.current.refresh = createNoHrefHandler(router.refresh);
    extendedRouterRef.current.forward = createNoHrefHandler(router.forward);
  }

  return extendedRouterRef.current;
}
