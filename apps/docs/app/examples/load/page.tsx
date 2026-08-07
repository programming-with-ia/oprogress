const LoadPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Load</h1>
      <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl">
        This page takes 5 seconds to render (server-side). The progress bar at
        the top stays running until the page is ready.
      </p>
    </div>
  );
};

export default LoadPage;