"use client";
import { useState, useEffect } from "react";
import Layout from "app/layout/Layout";
import { Button } from "app/components/ui/button";
import { Card, CardContent } from "app/components/ui/card";
import { Label } from "app/components/ui/label";
import { Input } from "app/components/ui/input";

export default function ClientesMascotas() {
  const [clientes, setClientes] = useState<
    {
      id: number;
      nombre: string;
      apellido: string;
      telefono: string;
      email: string;
      mascotas?: {
        id: number;
        nombre: string;
        especie: string;
        raza: string;
        edad: number;
      }[];
    }[]
  >([]);
  const [formCliente, setFormCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  });
  const [formMascota, setFormMascota] = useState<{
    [key: number]: {
      nombre: string;
      especie: string;
      raza: string;
      edad: number;
    };
  }>({});

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    try {
      const res = await fetch("/api/clientes");
      if (!res.ok) throw new Error("Error al obtener clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmitCliente(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formCliente),
      });

      if (!res.ok) throw new Error("Error al agregar cliente");

      setFormCliente({ nombre: "", apellido: "", telefono: "", email: "" });
      fetchClientes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmitMascota(e: React.FormEvent, clienteId: number) {
    e.preventDefault();
    try {
      const mascotaData = formMascota[clienteId];
      if (
        !mascotaData ||
        !mascotaData.nombre ||
        !mascotaData.especie ||
        !mascotaData.raza ||
        mascotaData.edad === undefined
      )
        return;

      const res = await fetch(`/api/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...mascotaData, clienteId }),
      });

      if (!res.ok) throw new Error("Error al agregar mascota");

      // Restablecer todos los campos de la mascota
      setFormMascota((prev) => ({
        ...prev,
        [clienteId]: { nombre: "", especie: "", raza: "", edad: 0 },
      }));

      fetchClientes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteCliente(id: number) {
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar cliente");

      fetchClientes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteMascota(id: number) {
    try {
      const res = await fetch(`/api/mascotas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar mascota");

      fetchClientes();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-xl font-bold">Clientes y sus Mascotas</h1>

        {/* Formulario para agregar un nuevo cliente */}
        <form onSubmit={handleSubmitCliente} className="my-4 space-y-2">
          <Label>Nombre</Label>
          <Input
            value={formCliente.nombre}
            onChange={(e) =>
              setFormCliente({ ...formCliente, nombre: e.target.value })
            }
            required
          />
          <Label>Apellido</Label>
          <Input
            value={formCliente.apellido}
            onChange={(e) =>
              setFormCliente({ ...formCliente, apellido: e.target.value })
            }
            required
          />
          <Label>Teléfono</Label>
          <Input
            value={formCliente.telefono}
            onChange={(e) =>
              setFormCliente({ ...formCliente, telefono: e.target.value })
            }
            required
          />
          <Label>Email</Label>
          <Input
            value={formCliente.email}
            onChange={(e) =>
              setFormCliente({ ...formCliente, email: e.target.value })
            }
            required
          />
          <Button type="submit">Agregar Cliente</Button>
        </form>

        {/* Lista de clientes y sus mascotas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientes.map((cliente) => (
            <Card key={cliente.id}>
              <CardContent>
                <h2 className="font-bold">
                  {cliente.nombre} {cliente.apellido}
                </h2>
                <p>Tel: {cliente.telefono}</p>
                <p>Email: {cliente.email}</p>

                <h3 className="mt-2 font-semibold">Mascotas:</h3>
                <ul>
                  {cliente.mascotas?.length ? (
                    cliente.mascotas.map((mascota) => (
                      <li key={mascota.id}>
                        {mascota.nombre} - {mascota.especie}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleDeleteMascota(mascota.id)}
                        >
                          ❌
                        </Button>
                      </li>
                    ))
                  ) : (
                    <p>No tiene mascotas registradas</p>
                  )}
                </ul>

                {/* Formulario para agregar mascota */}
                <form
                  onSubmit={(e) => handleSubmitMascota(e, cliente.id)}
                  className="mt-2 space-y-2"
                >
                  <Label>Nombre de Mascota</Label>
                  <Input
                    value={formMascota[cliente.id]?.nombre || ""}
                    onChange={(e) =>
                      setFormMascota((prev) => ({
                        ...prev,
                        [cliente.id]: {
                          ...prev[cliente.id],
                          nombre: e.target.value,
                        },
                      }))
                    }
                    required
                  />
                  <Label>Especie</Label>
                  <Input
                    value={formMascota[cliente.id]?.especie || ""}
                    onChange={(e) =>
                      setFormMascota((prev) => ({
                        ...prev,
                        [cliente.id]: {
                          ...prev[cliente.id],
                          especie: e.target.value,
                        },
                      }))
                    }
                    required
                  />
                  <Label>Raza</Label>
                  <Input
                    value={formMascota[cliente.id]?.raza || ""}
                    onChange={(e) =>
                      setFormMascota((prev) => ({
                        ...prev,
                        [cliente.id]: {
                          ...prev[cliente.id],
                          raza: e.target.value,
                        },
                      }))
                    }
                    required
                  />

                  <Label>Edad</Label>
                  <Input
                    type="number"
                    value={formMascota[cliente.id]?.edad || ""}
                    onChange={(e) =>
                      setFormMascota((prev) => ({
                        ...prev,
                        [cliente.id]: {
                          ...prev[cliente.id],
                          edad: Number(e.target.value),
                        },
                      }))
                    }
                    required
                  />

                  <Button type="submit">Agregar Mascota</Button>
                </form>

                <Button
                  variant="destructive"
                  className="mt-2"
                  onClick={() => handleDeleteCliente(cliente.id)}
                >
                  Eliminar Cliente
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
