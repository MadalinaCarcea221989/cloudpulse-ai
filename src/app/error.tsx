"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="glass-card w-full max-w-md p-8 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          A runtime error occurred while rendering this page. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2 rounded-lg border border-border text-foreground hover:border-primary/50 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
