'use client';

import { Button } from '@workspace/ui/components/ui/button';
import { useRouter } from '@oprogress/next/app';
import { useEffect, useState } from 'react';

const Mounted = () => {
  const router = useRouter();
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    router.replace('/examples/mounted');
    console.log('Home mounted');
  }, [router, counter]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Mounted</h1>
      <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl">
        This page calls <code>router.replace()</code> on mount. Increment the
        counter to trigger another replace.
      </p>

      <Button onClick={() => setCounter((prev) => prev + 1)}>
        Counter: {counter}
      </Button>
    </div>
  );
};

export default Mounted;