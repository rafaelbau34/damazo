import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MyWebsite
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/cita" className="hover:text-gray-200">
              Cita
            </Link>
          </li>

          <li>
            <Link href="/tratamiento" className="hover:text-gray-200">
              tratamiento
            </Link>
          </li>
          <li>
            <Link href="/facturas" className="hover:text-gray-200">
              Facturas
            </Link>
          </li>
          <li>
            <Link href="/mascotas" className="hover:text-gray-200">
              Clientes/Mascotas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
