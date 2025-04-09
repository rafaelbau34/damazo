"use client";

import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <Instagram className="h-6 w-6" />
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} CAN GALÁN. Todos los derechos
              reservados.
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex justify-center space-x-6"></div>
        </div>
      </div>
    </footer>
  );
}
