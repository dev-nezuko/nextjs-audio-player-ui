import type { Metadata } from "next";
import { Suspense } from "react";

import { Sidebar } from "@/components/Sidebar/Sidebar";
import "./globals.css";
import { LibraryProvider } from "@/contexts/LibraryContext";

export const metadata: Metadata = {
  title: "Spotify library browser",
  description:
    "Next.js prototype for Spotify track search and saved-library browsing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Suspense>
          <LibraryProvider>
            <Sidebar>{children}</Sidebar>
          </LibraryProvider>
        </Suspense>
      </body>
    </html>
  );
}
