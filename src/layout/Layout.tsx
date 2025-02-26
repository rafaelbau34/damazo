import Footer from "app/components/ui/Footer";
import Navbar from "app/components/ui/Navbar";
import React from "react";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main className="p-2">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
