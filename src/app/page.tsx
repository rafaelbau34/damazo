"use client";

import { Button } from "app/components/ui/button";
import Link from "next/link";
import { Layout } from "app/layout/Layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-32px)] bg-amber-50 px-4 py-12">
        <header className="text-center mb-10">
          <h1
            className="text-5xl font-bold text-red-500 mb-4"
            style={{ fontFamily: "'Gravitas One', cursive" }}
          >
            CAN GALÁN
          </h1>
          <p className="text-gray-700 text-lg">
            Cuidamos a tus mascotas con amor y profesionalismo.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-center max-w-6xl w-full">
          {/* Service cards remain the same */}
        </div>

        <div className="mt-10">
          <Link href="/dashboard">
            <Button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-lg">
              Ir al Panel de Gestión
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
