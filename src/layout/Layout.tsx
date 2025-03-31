"use client";

import { Navbar } from "app/components/ui/Navbar";
import { Footer } from "app/components/ui/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 pb-8">{children}</main>
      <Footer />
    </div>
  );
}
