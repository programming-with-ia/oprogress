import { observeUrl as observeUrlInternal } from 'window-change-events/url';
import type { UrlChangeEvent } from 'window-change-events/url';
import type { ProgressBarInstance } from './createProgressBar';

let isListenerAttached = false;
let globalProgressInstance: ProgressBarInstance | null = null;
let currentUrlObserverOff: (() => void) | null = null;
let lastObservedUrl: string | null = null;

export interface ListenerOptions {
  shallowRouting?: boolean;
}

let globalOptions: ListenerOptions = {};

export function setupGlobalListeners(
  progressInstance: ProgressBarInstance,
  options: ListenerOptions = {}
) {
  if (typeof window === 'undefined') return () => {};

  globalProgressInstance = progressInstance;
  globalOptions = options;

  if (!isListenerAttached) {
    document.addEventListener('click', handleGlobalClick, { capture: true });
    isListenerAttached = true;
  }

  if (currentUrlObserverOff) {
    currentUrlObserverOff();
  }

  lastObservedUrl = window.location.href;
  currentUrlObserverOff = observeUrlInternal();
  window.addEventListener('urlchange', handleUrlChange);

  return () => {
    window.removeEventListener('urlchange', handleUrlChange);
    if (currentUrlObserverOff) {
      currentUrlObserverOff();
      currentUrlObserverOff = null;
    }
  };
}

export function teardownGlobalListeners() {
  if (!isListenerAttached) return;
  document.removeEventListener('click', handleGlobalClick, { capture: true });
  isListenerAttached = false;
  globalProgressInstance = null;
  if (currentUrlObserverOff) {
    currentUrlObserverOff();
    currentUrlObserverOff = null;
  }
}

function handleGlobalClick(event: MouseEvent) {
  if (!globalProgressInstance) return;
  const target = event.target as HTMLElement;
  const ignorePreventDefault = target.closest('[data-ignore-prevent-default="true"]');

  if (event.defaultPrevented && !ignorePreventDefault) return;

  const anchor = target.closest('a');
  const forceElement = target.closest('[data-force-progress="true"]');

  if (forceElement) {
    globalProgressInstance.start();
    return;
  }

  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href) return;
  
  if (
    anchor.getAttribute('target') === '_blank' ||
    anchor.hasAttribute('download') ||
    href.startsWith('tel:') ||
    href.startsWith('mailto:') ||
    href.startsWith('blob:') ||
    href.startsWith('javascript:')
  ) {
    return;
  }

  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
    return;
  }

  if (
    anchor.getAttribute('data-prevent-progress') === 'true' ||
    anchor.getAttribute('data-disable-progress') === 'true'
  ) {
    return;
  }

  const { shallowRouting = false } = globalOptions;

  const targetUrl = new URL(anchor.href, window.location.href);
  const currentUrl = new URL(window.location.href);

  if (shallowRouting && targetUrl.pathname === currentUrl.pathname && targetUrl.search !== currentUrl.search) {
    if (!forceElement) return;
  }

  if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
    return;
  }

  globalProgressInstance.start();
}

function handleUrlChange(event: UrlChangeEvent) {
  if (!globalProgressInstance) return;

  const newUrl = new URL(event.detail.url, window.location.href);
  if (isSamePathAndSearch(newUrl)) {
    lastObservedUrl = newUrl.href;
    return;
  }
  lastObservedUrl = event.detail.url;

  // Delay the completion slightly to avoid "useInsertionEffect must not schedule updates" error in React 18+
  // This happens because Next.js might call pushState during a React render phase.
  setTimeout(() => {
    globalProgressInstance!.done();
  }, 0);
}

function isSamePathAndSearch(targetUrl: URL) {
  if (!lastObservedUrl) return false;
  const currentUrl = new URL(lastObservedUrl, window.location.href);
  return targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search;
}

// Re-export observeUrl for manual usage
export const observeUrl = observeUrlInternal;
