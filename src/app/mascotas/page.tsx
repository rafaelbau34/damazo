"use client";
import { useState, useEffect } from "react";
import { Layout } from "app/layout/Layout";
import { Button } from "app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "app/components/ui/card";
import { Label } from "app/components/ui/label";
import { Input } from "app/components/ui/input";
import { Separator } from "app/components/ui/separator";
import {
  PlusCircle,
  Trash2,
  PawPrint,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Cliente = {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  email: string;
  mascotas?: Mascota[];
};

type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
};

export default function ClientesMascotas() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formCliente, setFormCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
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
  const [activeTab, setActiveTab] = useState<"clientes" | "mascotas">(
    "clientes"
  );
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [showPetForms, setShowPetForms] = useState<Record<number, boolean>>({});

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

      setFormCliente({
        nombre: "",
        apellido: "",
        telefono: "",
        direccion: "",
        email: "",
      });
      setIsAddingClient(false);
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

      setFormMascota((prev) => ({
        ...prev,
        [clienteId]: { nombre: "", especie: "", raza: "", edad: 0 },
      }));
      setShowPetForms((prev) => ({ ...prev, [clienteId]: false }));
      fetchClientes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteCliente(id: number) {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar este cliente y todas sus mascotas?"
      )
    )
      return;
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar cliente");
      fetchClientes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteMascota(id: number) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta mascota?")) return;
    try {
      const res = await fetch(`/api/mascotas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar mascota");
      fetchClientes();
    } catch (error) {
      console.error(error);
    }
  }

  const togglePetForm = (clienteId: number) => {
    setShowPetForms((prev) => ({
      ...prev,
      [clienteId]: !prev[clienteId],
    }));
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Clientes y Mascotas</h1>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "clientes" ? "default" : "outline"}
              onClick={() => setActiveTab("clientes")}
            >
              Clientes
            </Button>
            <Button
              variant={activeTab === "mascotas" ? "default" : "outline"}
              onClick={() => setActiveTab("mascotas")}
            >
              Mascotas
            </Button>
          </div>
        </div>

        {activeTab === "clientes" && (
          <>
            <div className="mb-6">
              <Button
                onClick={() => setIsAddingClient(!isAddingClient)}
                variant={isAddingClient ? "secondary" : "default"}
                className="gap-2"
              >
                <PlusCircle size={16} />
                {isAddingClient ? "Cancelar" : "Agregar Cliente"}
              </Button>

              {isAddingClient && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Nuevo Cliente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitCliente} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nombre</Label>
                          <Input
                            value={formCliente.nombre}
                            onChange={(e) =>
                              setFormCliente({
                                ...formCliente,
                                nombre: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label>Apellido</Label>
                          <Input
                            value={formCliente.apellido}
                            onChange={(e) =>
                              setFormCliente({
                                ...formCliente,
                                apellido: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label>Teléfono</Label>
                          <Input
                            value={formCliente.telefono}
                            onChange={(e) =>
                              setFormCliente({
                                ...formCliente,
                                telefono: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={formCliente.email}
                            onChange={(e) =>
                              setFormCliente({
                                ...formCliente,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Dirección</Label>
                          <Input
                            value={formCliente.direccion}
                            onChange={(e) =>
                              setFormCliente({
                                ...formCliente,
                                direccion: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="mt-2">
                        Guardar Cliente
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientes.map((cliente) => (
                <Card key={cliente.id} className="flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {cliente.nombre} {cliente.apellido}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {cliente.email}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCliente(cliente.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Teléfono:</span>{" "}
                        {cliente.telefono}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Dirección:</span>{" "}
                        {cliente.direccion}
                      </p>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Mascotas</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary gap-1"
                          onClick={() => togglePetForm(cliente.id)}
                        >
                          {showPetForms[cliente.id] ? (
                            <>
                              <ChevronUp size={14} />
                              Ocultar
                            </>
                          ) : (
                            <>
                              <PlusCircle size={14} />
                              Agregar
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {cliente.mascotas?.length ? (
                          cliente.mascotas.map((mascota) => (
                            <div
                              key={mascota.id}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <PawPrint size={14} className="text-primary" />
                                <span className="text-sm">
                                  {mascota.nombre} ({mascota.especie},{" "}
                                  {mascota.edad} años)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteMascota(mascota.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No tiene mascotas registradas
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  {showPetForms[cliente.id] && (
                    <CardFooter className="border-t pt-4">
                      <form
                        onSubmit={(e) => handleSubmitMascota(e, cliente.id)}
                        className="w-full space-y-3"
                      >
                        <h4 className="text-sm font-medium">Nueva Mascota</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="col-span-2">
                            <Input
                              placeholder="Nombre"
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
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Especie"
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
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Raza"
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
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Edad"
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
                              className="h-9"
                            />
                          </div>
                          <div className="col-span-2">
                            <Button type="submit" className="w-full h-9">
                              Guardar Mascota
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "mascotas" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Todas las Mascotas</CardTitle>
                <CardDescription>
                  Lista completa de mascotas registradas en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientes.length === 0 ? (
                  <p className="text-muted-foreground">
                    No hay clientes registrados
                  </p>
                ) : (
                  <div className="space-y-4">
                    {clientes
                      .filter((c) => c.mascotas?.length)
                      .map((cliente) => (
                        <div key={cliente.id} className="space-y-2">
                          <h3 className="font-medium">
                            Mascotas de {cliente.nombre} {cliente.apellido}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {cliente.mascotas?.map((mascota) => (
                              <Card key={mascota.id} className="p-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">
                                      {mascota.nombre}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {mascota.especie} • {mascota.raza} •{" "}
                                      {mascota.edad} años
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() =>
                                      handleDeleteMascota(mascota.id)
                                    }
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
