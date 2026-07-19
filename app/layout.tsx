import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/styles/globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "@/components/providers/socket-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ClientHub AI",
    template: "%s · ClientHub AI",
  },
  description: "AI-powered operating system for freelancers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SocketProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </SocketProvider>
          </AuthProvider>
          <Toaster position="top-right" theme="dark" className="toaster-glass" />
        </ThemeProvider>
      </body>
    </html>
  );
}
