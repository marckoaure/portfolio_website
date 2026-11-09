import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
        404
      </span>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
        Nothing here.
      </h1>
      <p className="mt-4 max-w-md text-subtle">
        This page does not exist. The whole portfolio lives on one page, so
        everything is a scroll away from the start.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full border border-fg bg-fg px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-transparent hover:text-fg"
      >
        Back home
      </Link>
    </main>
  );
}
