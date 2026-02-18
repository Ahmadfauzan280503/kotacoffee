"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-red-500 mb-6">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        className="px-4 py-2 bg-success text-white rounded-md"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
