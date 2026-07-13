"use client";

import { ArrowLeft, Home, Construction } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface ComingSoonPageProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
}

export function ComingSoonPage({
  title = "Coming Soon",
  description = "This section is planned and will be available in a future update.",
  icon: Icon = Construction,
}: ComingSoonPageProps) {
  const router = useRouter();

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
              <Icon className="size-12" style={{ color: "var(--color-primary)" }} />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>

          {/* Description */}
          <p className="mb-8 text-center text-muted-foreground">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="h-12 rounded-xl"
            >
              <ArrowLeft className="mr-2 size-4" />
              Go Back
            </Button>

            <Link href="/client">
              <Button
                className="h-12 w-full rounded-xl sm:w-auto"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Home className="mr-2 size-4" />
                Go to Dashboard
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
