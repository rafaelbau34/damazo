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
            <Link href="/about" className="hover:text-gray-200">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-200">
              Contact
            </Link>
          </li>
<<<<<<< HEAD

          <li>
            <Link href="/mascotas" className="hover:text-gray-200">
              Mascotas
            </Link>
          </li>
          <li>
            <Link href="/clientes" className="hover:text-gray-200">
              Clientes
=======
          <li>
            <Link href="/facturas" className="hover:text-gray-200">
              Facturas
>>>>>>> 6bb0f3b3847e33a7e9172968082b8ca050624991
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
