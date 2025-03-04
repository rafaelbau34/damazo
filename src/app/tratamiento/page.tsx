"use client";

import { useEffect, useState } from "react";
import { Button } from "app/components/ui/button";
import { Card , CardContent} from "app/components/ui/card";
import Layout from "app/layout/Layout";

interface Tratamiento {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion: number;
  activo: boolean;
}

export default function TratamientosPage() {
  const [estado, setEstado] = useState<{ tratamientos: Tratamiento[]; loading: boolean; error: string | null }>({
    tratamientos: [],
    loading: true,
    error: null,
  });

  const fetchTratamientos = async () => {
    setEstado({ ...estado, loading: true, error: null });
    try {
      const res = await fetch("http://localhost:3000/api/tratamiento");
      if (!res.ok) throw new Error("Error al obtener tratamientos");
      const data: Tratamiento[] = await res.json();
      setEstado({ tratamientos: data, loading: false, error: null });
    } catch (error: any) {
      setEstado({ ...estado, loading: false, error: "Hubo un problema al cargar los tratamientos." });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTratamientos();
  }, []);

  return (
    <Layout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Tratamientos</h1>
      <Button onClick={fetchTratamientos} disabled={estado.loading}>
        {estado.loading ? "Cargando..." : "Recargar"}
      </Button>

      {/* Mostrar error si ocurre uno */}
      {estado.error && <p className="text-red-500 mt-4">{estado.error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {estado.tratamientos.length === 0 ? (
          <p className="text-gray-500">No se encontraron tratamientos.</p>
        ) : (
          estado.tratamientos.map((tratamiento) => (
            <Card key={tratamiento.id} className="p-4 border rounded-lg shadow-md">
              <CardContent>
                <h2 className="text-xl font-semibold">{tratamiento.nombre}</h2>
                <p className="text-gray-600">{tratamiento.descripcion || "Sin descripción"}</p>
                <p className="text-green-600 font-bold">${tratamiento.precio}</p>
                <p className="text-gray-500">Duración: {tratamiento.duracion} min</p>
                <p
                  className={`mt-2 font-semibold ${tratamiento.activo ? "text-blue-600" : "text-red-600"}`}
                >
                  {tratamiento.activo ? "Activo" : "Inactivo"}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
    </Layout>
  );
}
