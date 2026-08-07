'use client';

import { OProgress } from '@oprogress/react';
import '@oprogress/react/css';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OProgress
        height="4px"
        color="currentColor"
        shallowRouting
      />
      {children}
    </>
  );
};

export default Providers;
