"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PawPrint,
  CalendarDays,
  Stethoscope,
  FileText,
  Users,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Citas",
      href: "/cita",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      name: "Tratamientos",
      href: "/tratamiento",
      icon: <Stethoscope className="h-5 w-5" />,
    },
    {
      name: "Facturas",
      href: "/facturas",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Clientes/Mascotas",
      href: "/mascotas",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Veterinarios",
      href: "/veterinarios",
      icon: <PawPrint className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <PawPrint className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                CAN GALÁN
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? "bg-red-50 text-red-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
