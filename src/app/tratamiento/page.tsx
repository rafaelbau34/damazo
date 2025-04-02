"use client";

import { useEffect, useState } from "react";
import { Button } from "app/components/ui/button";
import { Card, CardContent } from "app/components/ui/card";
import { Layout } from "app/layout/Layout";

interface Tratamiento {
  id: string;
  tratamientochat: string;
  descripcion?: string;
  precio: number;
  duracion: number;
  activo: boolean;
}

export default function TratamientosPage() {
  const [estado, setEstado] = useState<{
    tratamientos: Tratamiento[];
    loading: boolean;
    error: string | null;
  }>({
    tratamientos: [],
    loading: true,
    error: null,
  });

  const [nuevoTratamiento, setNuevoTratamiento] = useState({
    tratamientochat: "",
    descripcion: "",
    precio: "",
    duracion: "",
    activo: true,
  });

  const fetchTratamientos = async () => {
    setEstado((prevEstado) => ({ ...prevEstado, loading: true, error: null }));
    try {
      const res = await fetch("http://localhost:3000/api/tratamiento");
      if (!res.ok) throw new Error("Error al obtener tratamientos");
      const data: Tratamiento[] = await res.json();
      setEstado({ tratamientos: data, loading: false, error: null });
    } catch (error: any) {
      setEstado((prevEstado) => ({
        ...prevEstado,
        loading: false,
        error: "Hubo un problema al cargar los tratamientos.",
      }));
      console.error(error);
    }
  };

  const agregarTratamiento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/tratamiento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tratamientochat: nuevoTratamiento.tratamientochat,
          descripcion: nuevoTratamiento.descripcion,
          precio: parseFloat(nuevoTratamiento.precio),
          duracion: parseInt(nuevoTratamiento.duracion),
          activo: nuevoTratamiento.activo,
        }),
      });

      if (!res.ok) throw new Error("Error al agregar tratamiento");
      fetchTratamientos();
      setNuevoTratamiento({ tratamientochat: "", descripcion: "", precio: "", duracion: "", activo: true });
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTratamientos();
  }, []);

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-600">Lista de Tratamientos</h1>
        <div className="flex justify-center mb-4">
          <Button
            onClick={fetchTratamientos}
            disabled={estado.loading}
            className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded shadow-md"
          >
            {estado.loading ? "Cargando..." : "Recargar"}
          </Button>
        </div>

        <form onSubmit={agregarTratamiento} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Agregar Tratamiento</h2>
          <input
            type="text"
            placeholder="Tratamiento"
            value={nuevoTratamiento.tratamientochat}
            onChange={(e) => setNuevoTratamiento({ ...nuevoTratamiento, tratamientochat: e.target.value })}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoTratamiento.descripcion}
            onChange={(e) => setNuevoTratamiento({ ...nuevoTratamiento, descripcion: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoTratamiento.precio}
            onChange={(e) => setNuevoTratamiento({ ...nuevoTratamiento, precio: e.target.value })}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="number"
            placeholder="Duración (min)"
            value={nuevoTratamiento.duracion}
            onChange={(e) => setNuevoTratamiento({ ...nuevoTratamiento, duracion: e.target.value })}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <button type="submit" className="bg-red-600 hover:bg-red-800 text-white p-2 rounded w-full">
            Agregar Tratamiento
          </button>
        </form>

        {estado.error && <p className="text-red-500 text-center mt-4">{estado.error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {estado.tratamientos.length === 0 ? (
            <p className="text-gray-500 text-center w-full">No se encontraron tratamientos.</p>
          ) : (
            estado.tratamientos.map((tratamiento) => (
              <Card key={tratamiento.id} className="p-4 border rounded-lg shadow-md bg-white">
                <CardContent>
                  <h2 className="text-xl font-semibold text-red-600">{tratamiento.tratamientochat}</h2>
                  <p className="text-gray-600">{tratamiento.descripcion || "Sin descripción"}</p>
                  <p className="text-red-600 font-bold">${tratamiento.precio}</p>
                  <p className="text-gray-500">Duración: {tratamiento.duracion} min</p>
                  <p className={`mt-2 font-semibold ${tratamiento.activo ? "text-blue-600" : "text-red-600"}`}>
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
