import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-amber-50 p-4 shadow-md border-b-4 border-red-500">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-bold text-red-500"
          style={{ fontFamily: "Gravitas One, sans-serif" }}
        >
          CAN GALÁN
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/cita"
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Cita
            </Link>
          </li>
          <li>
            <Link
              href="/tratamiento"
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Tratamiento
            </Link>
          </li>
          <li>
            <Link
              href="/facturas"
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Facturas
            </Link>
          </li>
          <li>
            <Link
              href="/mascotas"
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Clientes/Mascotas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
