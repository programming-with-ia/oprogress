import type {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Helper type to infer router-specific options from the push method signature.
 */
export type InferRouterOptions<T extends AppRouterInstance> = T extends {
  push(href: string, options?: infer O): void;
}
  ? O
  : NavigateOptions;

/**
 * Helper type to infer prefetch-specific options from the push method signature.
 */
export type InferPrefetchOptions<T extends AppRouterInstance> = T extends {
  prefetch(href: string, options?: infer O): void;
}
  ? O
  : PrefetchOptions;

/**
 * Options for the progress bar.
 */
export interface RouterActionsProgressOptions {
  showProgress?: boolean;
  startPosition?: number;
  delay?: number;
  stopDelay?: number;
}

/**
 * Combined options type merging router-specific options with progress options.
 */
export type CombinedRouterOptions<ROpts> = ROpts & RouterActionsProgressOptions;

/**
 * Extended router interface to include progress bar functionality.
 */
export interface AppRouterProgressInstance<
  ROpts = NavigateOptions,
  POpts = PrefetchOptions,
> {
  push(href: string, options?: CombinedRouterOptions<ROpts>): void;
  replace(href: string, options?: CombinedRouterOptions<ROpts>): void;
  prefetch(href: string, options?: POpts): void;
  back(options?: CombinedRouterOptions<ROpts>): void;
  refresh(options?: CombinedRouterOptions<ROpts>): void;
  forward(options?: CombinedRouterOptions<ROpts>): void;
}
