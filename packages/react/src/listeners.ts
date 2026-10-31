import { observeUrl as observeUrlInternal } from 'window-change-events/url';
import type { UrlChangeEvent } from 'window-change-events/url';
import type { ProgressBarInstance } from './createProgressBar';

export interface ListenerOptions {
  shallowRouting?: boolean;
  dragThreshold?: number;
}

interface Registration {
  instance: ProgressBarInstance;
  options: ListenerOptions;
}

const registrations = new Map<symbol, Registration>();

let activeRegistration: Registration | null = null;
let isListenerAttached = false;
let currentUrlObserverOff: (() => void) | null = null;
let lastObservedUrl: string | null = null;
let completionTimer: ReturnType<typeof setTimeout> | null = null;

let pointerStart: {
  id: number;
  x: number;
  y: number;
} | null = null;

let wasDragged = false;

function cancelPendingCompletion() {
  if (completionTimer !== null) {
    clearTimeout(completionTimer);
    completionTimer = null;
  }
}

function resetPointerState() {
  pointerStart = null;
  wasDragged = false;
}

function selectActiveRegistration() {
  let nextRegistration: Registration | null = null;

  // The most recently added registration takes precedence.
  for (const registration of registrations.values()) {
    nextRegistration = registration;
  }

  if (nextRegistration === activeRegistration) return;

  cancelPendingCompletion();
  resetPointerState();

  activeRegistration = nextRegistration;
  lastObservedUrl = nextRegistration ? window.location.href : null;
}

function attachListeners() {
  if (isListenerAttached) return;

  document.addEventListener('pointerdown', handlePointerDown, true);
  document.addEventListener('pointermove', handlePointerMove, true);
  document.addEventListener('pointerup', handlePointerUp, true);
  document.addEventListener('pointercancel', handlePointerCancel, true);
  document.addEventListener('click', handleGlobalClick, true);
  window.addEventListener('urlchange', handleUrlChange);

  currentUrlObserverOff = observeUrlInternal();
  isListenerAttached = true;
}

function detachListeners() {
  cancelPendingCompletion();

  if (isListenerAttached) {
    document.removeEventListener('pointerdown', handlePointerDown, true);
    document.removeEventListener('pointermove', handlePointerMove, true);
    document.removeEventListener('pointerup', handlePointerUp, true);
    document.removeEventListener('pointercancel', handlePointerCancel, true);
    document.removeEventListener('click', handleGlobalClick, true);
    window.removeEventListener('urlchange', handleUrlChange);

    isListenerAttached = false;
  }

  if (currentUrlObserverOff) {
    const off = currentUrlObserverOff;
    currentUrlObserverOff = null;
    off();
  }

  resetPointerState();
  lastObservedUrl = null;
}

export function setupGlobalListeners(
  progressInstance: ProgressBarInstance,
  options: ListenerOptions = {}
): () => void {
  if (typeof window === 'undefined') return () => {};

  const registrationId = Symbol('oprogress-listener');

  registrations.set(registrationId, {
    instance: progressInstance,
    options: { ...options },
  });

  selectActiveRegistration();
  attachListeners();

  return () => {
    // Cleanup is idempotent and only removes its own registration.
    if (!registrations.delete(registrationId)) return;

    selectActiveRegistration();

    if (registrations.size === 0) {
      detachListeners();
    }
  };
}

export function teardownGlobalListeners() {
  if (typeof window === 'undefined') return;

  registrations.clear();
  activeRegistration = null;
  detachListeners();
}

function getDragThreshold() {
  const threshold = activeRegistration?.options.dragThreshold;

  return typeof threshold === 'number' &&
    Number.isFinite(threshold) &&
    threshold >= 0
    ? threshold
    : 10;
}

function handlePointerDown(event: PointerEvent) {
  if (!event.isPrimary || event.button !== 0) return;

  pointerStart = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
  };

  wasDragged = false;
}

function handlePointerMove(event: PointerEvent) {
  if (
    !pointerStart ||
    event.pointerId !== pointerStart.id ||
    wasDragged
  ) {
    return;
  }

  const distance = Math.hypot(
    event.clientX - pointerStart.x,
    event.clientY - pointerStart.y
  );

  if (distance > getDragThreshold()) {
    wasDragged = true;
  }
}

function handlePointerUp(event: PointerEvent) {
  handlePointerMove(event);

  if (event.pointerId === pointerStart?.id) {
    pointerStart = null;
  }
}

function handlePointerCancel(event: PointerEvent) {
  if (event.pointerId !== pointerStart?.id) return;

  pointerStart = null;
  wasDragged = true;
}

function startProgress(registration: Registration) {
  cancelPendingCompletion();
  registration.instance.start();
}

function handleGlobalClick(event: MouseEvent) {
  const registration = activeRegistration;
  if (!registration) return;

  // Preserve keyboard and programmatic activation.
  if (event.detail > 0 && wasDragged) return;

  if (!(event.target instanceof Element)) return;
  const target = event.target;

  const ignorePreventDefault = target.closest(
    '[data-ignore-prevent-default="true"]'
  );

  // This capture-phase check only sees cancellations made earlier.
  if (event.defaultPrevented && !ignorePreventDefault) return;

  const forceElement = target.closest('[data-force-progress="true"]');

  // Preserve the explicit override of normal link filtering.
  if (forceElement) {
    startProgress(registration);
    return;
  }

  if (
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const anchor = target.closest('a');

  if (!(anchor instanceof HTMLAnchorElement)) return;

  const href = anchor.getAttribute('href');

  if (!href?.trim() || anchor.hasAttribute('download')) return;

  // Include <base target="..."> when the anchor has no target.
  const linkTarget = (
    anchor.getAttribute('target') ??
    document.querySelector('base[target]')?.getAttribute('target') ??
    ''
  ).toLowerCase();

  if (linkTarget && linkTarget !== '_self') return;

  if (
    anchor.getAttribute('data-prevent-progress') === 'true' ||
    anchor.getAttribute('data-disable-progress') === 'true'
  ) {
    return;
  }

  let targetUrl: URL;

  try {
    targetUrl = new URL(anchor.href);
  } catch {
    return;
  }

  const currentUrl = new URL(window.location.href);

  if (
    (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') ||
    targetUrl.origin !== currentUrl.origin
  ) {
    return;
  }

  const samePath = targetUrl.pathname === currentUrl.pathname;
  const sameSearch = targetUrl.search === currentUrl.search;

  // Ignore same-page and hash-only navigation.
  if (samePath && sameSearch) return;

  // Ignore query-only navigation when shallow routing is enabled.
  if (registration.options.shallowRouting && samePath) return;

  startProgress(registration);
}

function handleUrlChange(event: UrlChangeEvent) {
  const registration = activeRegistration;
  if (!registration) return;

  let newUrl: URL;

  try {
    newUrl = new URL(event.detail.url, window.location.href);
  } catch {
    return;
  }

  const previousUrl = lastObservedUrl
    ? new URL(lastObservedUrl)
    : null;

  lastObservedUrl = newUrl.href;

  if (
    previousUrl &&
    newUrl.origin === previousUrl.origin &&
    newUrl.pathname === previousUrl.pathname &&
    newUrl.search === previousUrl.search
  ) {
    return;
  }

  cancelPendingCompletion();

  // Avoid scheduling React updates during a render phase.
  completionTimer = setTimeout(() => {
    completionTimer = null;

    if (activeRegistration === registration) {
      registration.instance.done();
    }
  }, 0);
}

// Re-export observeUrl for manual usage.
export const observeUrl = observeUrlInternal;
