"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { User, Mail, Palette, LogOut, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { cn, getInitials } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "";
  const userInitials = getInitials(userName);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Separator />

      {/* Account Section */}
      <div className="card-premium rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Account</h2>
        
        <div className="flex items-center gap-4">
          <Avatar className="size-16 ring-2 ring-border/50">
            <AvatarFallback
              className="text-lg font-semibold text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-lg font-medium">{userName}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="card-premium rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Appearance</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-xl"
              style={{ background: "var(--gradient-brand-subtle)" }}
            >
              <Palette className="size-5" style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark mode
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Session Section */}
      <div className="card-premium rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Session</h2>
        
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <User className="size-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <p className="font-medium">Active Session</p>
            <p className="text-sm text-muted-foreground">
              You are currently logged in as {userName}
            </p>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="card-premium rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Danger Zone</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-xl bg-destructive/10"
            >
              <LogOut className="size-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium">Log Out</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-xl"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 size-4" />
                Log Out
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
