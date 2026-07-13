import { ArrowLeft, Home, SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="card-premium card-interactive rounded-3xl p-8 md:p-12">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div
              className="flex size-24 items-center justify-center rounded-2xl"
              style={{ background: "var(--gradient-brand-subtle)" }}
            >
              <SearchX className="size-12" style={{ color: "var(--color-primary)" }} />
            </div>
          </div>

          {/* 404 Heading */}
          <h1 className="mb-2 text-center text-6xl font-bold tracking-tight md:text-7xl">
            404
          </h1>

          {/* Title */}
          <h2 className="mb-4 text-center text-2xl font-semibold tracking-tight">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="mb-8 text-center text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/client">
              <Button
                className="h-12 w-full rounded-xl sm:w-auto"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Home className="mr-2 size-4" />
                Back to Dashboard
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="h-12 w-full rounded-xl sm:w-auto">
                <ArrowLeft className="mr-2 size-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
          style={{
            background: "var(--gradient-brand-subtle)",
            filter: "blur(100px)",
          }}
        />
      </div>
    </div>
  );
}
