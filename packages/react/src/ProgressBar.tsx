"use client";

import React from 'react';
import type { ProgressState, ProgressReducers } from '@oprogress/core';
import { toBarPerc } from '@oprogress/core';

export interface ProgressBarProps {
  target?: 'body' | 'container';
  position?: 'top' | 'bottom';
  height?: number | string;
  color?: string;
  barStyle?: React.CSSProperties;
  indeterminateStyle?: React.CSSProperties;
  indeterminateClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
}

export function createProgressBarComponent(
  useProgressHook: () => [ProgressState, ProgressReducers]
) {
  return function ProgressBar(props: ProgressBarProps) {
    const [state] = useProgressHook();

    const {
      target = 'body',
      position = 'top',
      height = '3px',
      color = '#29d',
      barStyle,
      indeterminateStyle,
      indeterminateClassName,
      className,
      style,
      zIndex = 9999,
    } = props;

    if (!state.isStarted && !state.isIndeterminate && state.status === null) {
      return null;
    }

    const isFixed = target === 'body';
    
    // Core container positioning
    const containerStyle: React.CSSProperties = {
      pointerEvents: 'none',
      position: isFixed ? 'fixed' : 'absolute',
      top: position === 'top' ? 0 : 'auto',
      bottom: position === 'bottom' ? 0 : 'auto',
      left: 0,
      width: '100%',
      height,
      zIndex: isFixed ? zIndex : (zIndex !== 9999 ? zIndex : undefined),
      ...style,
    };

    if (state.isIndeterminate) {
      return (
        <div 
          className={`oprogress-container ${className || ''} ${indeterminateClassName || 'oprogress-indeterminate'}`} 
          style={containerStyle}
        >
          <div 
            className="oprogress-bar-indeterminate" 
            style={{
              ['--oprogress-color' as string]: color,
              height,
              width: '100%',
              ...barStyle,
              ...indeterminateStyle
            } as React.CSSProperties}
          />
        </div>
      );
    }

    // Normal Progress
    const perc = toBarPerc(state.status || 0, state.options.direction || 'ltr');
    let transform = `translate3d(${perc}%,0,0)`;
    if (state.options.direction === 'rtl') {
      transform = `translate3d(${-perc}%,0,0)`;
    }

    return (
      <div className={`oprogress-container ${className || ''}`} style={containerStyle}>
        <div
          className="oprogress-bar"
          style={{
            background: color,
            height,
            width: '100%',
            transform,
            transition: `all ${state.options.speed}ms ${state.options.easing}`,
            ...barStyle,
          }}
        />
      </div>
    );
  };
}
