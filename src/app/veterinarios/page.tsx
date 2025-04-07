"use client";

import { useEffect, useState } from "react";
import { Button } from "app/components/ui/button";
import { Card, CardContent } from "app/components/ui/card";
import { Layout } from "app/layout/Layout";
import { Input } from "app/components/ui/input";
import { Label } from "app/components/ui/label";

type Veterinario = {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  email: string;
};

export default function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [isAddingVeterinario, setIsAddingVeterinario] = useState(false);
  const [formVeterinario, setFormVeterinario] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    telefono: "",
    email: "",
    
  });
  const [estado, setEstado] = useState<{
    loading: boolean;
    error: string | null;
  }>({
    loading: false,
    error: null,
  });

  const fetchVeterinarios = async () => {
    setEstado({ loading: true, error: null });
    try {
      const res = await fetch("/api/veterinarios");
      if (!res.ok) throw new Error("Error al obtener veterinarios");
      const data: Veterinario[] = await res.json();
      setVeterinarios(data);
      setEstado({ loading: false, error: null });
    } catch (error) {
      setEstado({ loading: false, error: "Hubo un problema al cargar los veterinarios." });
      console.error(error);
    }
  };

  const handleSubmitVeterinario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/veterinarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formVeterinario),
      });

      if (!res.ok) throw new Error("Error al agregar veterinario");

      setFormVeterinario({
        nombre: "",
        apellido: "",
        especialidad: "",
        telefono: "",
        email: "",
        
      });
      setIsAddingVeterinario(false);
      fetchVeterinarios();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVeterinarios();
  }, []);

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-600">Gestión de Veterinarios</h1>
        
        <div className="flex justify-center mb-4">
          <Button
            onClick={() => setIsAddingVeterinario(!isAddingVeterinario)}
            className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded shadow-md"
          >
            {isAddingVeterinario ? "Cancelar" : "Agregar Veterinario"}
          </Button>
        </div>

        {isAddingVeterinario && (
          <form
            onSubmit={handleSubmitVeterinario}
            className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
          >
            <h2 className="text-xl font-semibold text-red-600 mb-4">Nuevo Veterinario</h2>
            <Input
              type="text"
              placeholder="Nombre"
              value={formVeterinario.nombre}
              onChange={(e) => setFormVeterinario({ ...formVeterinario, nombre: e.target.value })}
              className="border p-2 rounded w-full mb-2"
              required
            />
            <Input
              type="text"
              placeholder="Apellido"
              value={formVeterinario.apellido}
              onChange={(e) => setFormVeterinario({ ...formVeterinario, apellido: e.target.value })}
              className="border p-2 rounded w-full mb-2"
              required
            />
            <Input
              type="text"
              placeholder="Especialidad"
              value={formVeterinario.especialidad}
              onChange={(e) => setFormVeterinario({ ...formVeterinario, especialidad: e.target.value })}
              className="border p-2 rounded w-full mb-2"
              required
            />
            <Input
              type="text"
              placeholder="Teléfono"
              value={formVeterinario.telefono}
              onChange={(e) => setFormVeterinario({ ...formVeterinario, telefono: e.target.value })}
              className="border p-2 rounded w-full mb-2"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formVeterinario.email}
              onChange={(e) => setFormVeterinario({ ...formVeterinario, email: e.target.value })}
              className="border p-2 rounded w-full mb-2"
              required
            />
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-800 text-white p-2 rounded w-full"
            >
              Guardar Veterinario
            </Button>
          </form>
        )}

        {estado.error && <p className="text-red-500 text-center mt-4">{estado.error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {estado.loading ? (
            <p className="text-gray-500 text-center w-full">Cargando veterinarios...</p>
          ) : veterinarios.length === 0 ? (
            <p className="text-gray-500 text-center w-full">No se encontraron veterinarios.</p>
          ) : (
            veterinarios.map((veterinario) => (
              <Card key={veterinario.id} className="p-4 border rounded-lg shadow-md bg-white">
                <CardContent>
                  <h2 className="text-xl font-semibold text-red-600">{veterinario.nombre} {veterinario.apellido}</h2>
                  <p className="text-gray-600">{veterinario.especialidad}</p>
                  <p className="text-gray-500">Teléfono: {veterinario.telefono}</p>
                  <p className="text-gray-500">Email: {veterinario.email}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
