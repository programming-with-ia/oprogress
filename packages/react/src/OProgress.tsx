"use client";

import React, { useEffect, useRef } from 'react';
import { progress, ProgressBar } from './index';
import { setupGlobalListeners, teardownGlobalListeners } from './listeners';
import type { ProgressBarProps } from './ProgressBar';

export interface OProgressProps extends ProgressBarProps {
  shallowRouting?: boolean;
}

export function OProgress({ shallowRouting, ...progressBarProps }: OProgressProps) {
  const mountedRef = useRef(false);

  useEffect(() => {
    const cleanup = setupGlobalListeners(progress, { shallowRouting });
    mountedRef.current = true;
    return () => {
      cleanup();
      mountedRef.current = false;
      teardownGlobalListeners();
    };
  }, [shallowRouting]);

  return <ProgressBar {...progressBarProps} />;
}
