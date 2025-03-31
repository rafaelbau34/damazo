"use client";

import { Button } from "app/components/ui/button";
import Link from "next/link";
import { Layout } from "app/layout/Layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
        <header className="text-center mb-10">
          <h1
            className="text-5xl font-bold text-red-500"
            style={{ fontFamily: "Gravitas One, sans-serif" }}
          >
            CAN GALÁN
          </h1>
          <p className="text-gray-700 mt-4 text-lg">
            Cuidamos a tus mascotas con amor y profesionalismo.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-center">
          <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">
              Atención Veterinaria
            </h3>
            <p className="text-gray-600 mt-2">
              Consulta general y especializada para tus mascotas.
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">
              Peluquería y Estética
            </h3>
            <p className="text-gray-600 mt-2">
              Mantenemos a tus mascotas limpias y saludables.
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">Guardería</h3>
            <p className="text-gray-600 mt-2">
              Un lugar seguro para el cuidado diario de tus mascotas.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/dashboard">
            <Button className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
              Ir al Panel de Gestión
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
