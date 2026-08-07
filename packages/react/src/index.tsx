import { createProgressBar } from './createProgressBar';
import { setupGlobalListeners, observeUrl } from './listeners';

export * from '@oprogress/core';

// Create the default global instance
const progressInstance = createProgressBar();

// Export the singleton properties for easy access
export const progress = progressInstance;
export const useProgress = progressInstance.useProgress;
export const ProgressBar = progressInstance.ProgressBar;

export { createProgressBar, setupGlobalListeners, observeUrl };
export { OProgress } from './OProgress';
export type { OProgressProps } from './OProgress';
export type { ProgressBarInstance } from './createProgressBar';
export type { ProgressBarProps } from './ProgressBar';
export type { ListenerOptions } from './listeners';
