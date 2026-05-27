"use client";

declare global {
  interface Window {
    __E2E_ERROR_THROWN__?: boolean;
  }
}

export default function E2EErrorPage() {
  if (typeof window !== "undefined" && !window.__E2E_ERROR_THROWN__) {
    window.__E2E_ERROR_THROWN__ = true;
    throw new Error("E2E runtime error");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="glass-card px-6 py-4 text-center" data-testid="e2e-recovery">
        E2E recovery view
      </div>
    </div>
  );
}
