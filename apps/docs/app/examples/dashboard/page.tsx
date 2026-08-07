'use client';

import Link from 'next/link';
import { Button } from '@workspace/ui/components/ui/button';
import { useRouter } from '@oprogress/next/app';

const Dashboard = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl">
        Pushing the same URL triggers the progress bar automatically.
      </p>

      <Link
        href="/examples"
        className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Home
      </Link>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => router.push('/examples/dashboard')}>
          Pushing same url (triggers progress automatically!)
        </Button>
        <Button onClick={() => router.forward()} variant="outline">
          Forward
        </Button>
        <Button onClick={() => router.back()} variant="outline">
          Back
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
