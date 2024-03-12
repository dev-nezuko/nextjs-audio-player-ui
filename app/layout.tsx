import type { Metadata } from "next";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";

import { Sidebar } from "@/components/Sidebar/Sidebar";
import { LibraryProvider } from "@/contexts/LibraryContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crate · music library browser",
  description:
    "Next.js prototype for searching tracks and keeping a saved library. It does not play audio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-ink text-paper font-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <LibraryProvider>
          <Sidebar>{children}</Sidebar>
        </LibraryProvider>
      </body>
    </html>
  );
}
