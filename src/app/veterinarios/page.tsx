"use client";
import { useState, useEffect } from "react";
import { Layout } from "app/layout/Layout";
import { Button } from "app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "app/components/ui/card";
import { Label } from "app/components/ui/label";
import { Input } from "app/components/ui/input";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "app/components/ui/alert-dialog";
import { Skeleton } from "app/components/ui/skeleton"; // Para Skeleton Loader

type Veterinario = {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  especialidad: string;
};

export default function Veterinarios() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [formVeterinario, setFormVeterinario] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    especialidad: "",
  });
  const [isAddingVeterinario, setIsAddingVeterinario] = useState(false);
  const [isUpdatingVeterinario, setIsUpdatingVeterinario] = useState(false);
  const [currentVeterinario, setCurrentVeterinario] = useState<Veterinario | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: 0,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(true); // Para el skeleton loader

  useEffect(() => {
    fetchVeterinarios();
  }, []);

  async function fetchVeterinarios() {
    try {
      const res = await fetch("/api/veterinarios");
      if (!res.ok) throw new Error("Error al obtener veterinarios");
      const data = await res.json();
      setVeterinarios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Al finalizar la carga
    }
  }

  async function handleSubmitVeterinario(e: React.FormEvent) {
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
        telefono: "",
        email: "",
        especialidad: "",
      });
      setIsAddingVeterinario(false);
      fetchVeterinarios();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateVeterinario(e: React.FormEvent) {
    e.preventDefault();
    if (!currentVeterinario) return;

    try {
      const res = await fetch(`/api/veterinarios/${currentVeterinario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formVeterinario),
      });

      if (!res.ok) throw new Error("Error al actualizar veterinario");

      setFormVeterinario({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        especialidad: "",
      });
      setIsUpdatingVeterinario(false);
      setCurrentVeterinario(null);
      fetchVeterinarios();
    } catch (error) {
      console.error(error);
    }
  }

  function confirmDeleteVeterinario(id: number) {
    setDeleteDialog({
      open: true,
      id,
      message: "¿Estás seguro de que deseas eliminar este veterinario?",
    });
  }

  async function handleDeleteConfirmed() {
    try {
      const res = await fetch(`/api/veterinarios/${deleteDialog.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar veterinario");
      fetchVeterinarios();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteDialog({ open: false, id: 0, message: "" });
    }
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            setDeleteDialog((prev) => ({ ...prev, open }))
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
              <AlertDialogDescription>{deleteDialog.message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirmed}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="p-6 max-w-7xl mx-auto pt-20">
          <div className="flex justify-center items-center mb-6 animate__animated animate__fadeIn animate__delay-1s">
            <h1 className="text-3xl font-bold text-red-600">Gestión de Veterinarios</h1>
          </div>
          <div className="flex justify-center mb-4">
            <Button
              variant="default"
              onClick={() => setIsAddingVeterinario(!isAddingVeterinario)}
              className="bg-red-600 hover:bg-red-700"
            >
              {isAddingVeterinario ? "Cancelar" : "Agregar Veterinario"}
            </Button>
          </div>
        </div>

        {isAddingVeterinario || isUpdatingVeterinario ? (
          <Card className="mt-4 border-red-600 animate__animated animate__fadeIn animate__delay-1s">
            <CardHeader>
              <CardTitle>{isUpdatingVeterinario ? "Actualizar Veterinario" : "Nuevo Veterinario"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={isUpdatingVeterinario ? handleUpdateVeterinario : handleSubmitVeterinario}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={formVeterinario.nombre}
                      onChange={(e) =>
                        setFormVeterinario({
                          ...formVeterinario,
                          nombre: e.target.value,
                        })
                      }
                      required
                      className="border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input
                      value={formVeterinario.apellido}
                      onChange={(e) =>
                        setFormVeterinario({
                          ...formVeterinario,
                          apellido: e.target.value,
                        })
                      }
                      required
                      className="border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      value={formVeterinario.telefono}
                      onChange={(e) =>
                        setFormVeterinario({
                          ...formVeterinario,
                          telefono: e.target.value,
                        })
                      }
                      required
                      className="border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formVeterinario.email}
                      onChange={(e) =>
                        setFormVeterinario({
                          ...formVeterinario,
                          email: e.target.value,
                        })
                      }
                      required
                      className="border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label>Especialidad</Label>
                    <Input
                      value={formVeterinario.especialidad}
                      onChange={(e) =>
                        setFormVeterinario({
                          ...formVeterinario,
                          especialidad: e.target.value,
                        })
                      }
                      required
                      className="border-red-600 focus:ring-red-600"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="mt-2 bg-red-600 hover:bg-red-700"
                >
                  {isUpdatingVeterinario ? "Actualizar" : "Guardar Veterinario"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              ))
          ) : (
            veterinarios.map((veterinario) => (
              <Card key={veterinario.id} className="flex flex-col h-full border-red-600 transition-transform hover:scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-red-600">
                        {veterinario.nombre} {veterinario.apellido}
                      </CardTitle>
                      <CardDescription className="mt-1 text-red-500">
                        {veterinario.email}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setIsUpdatingVeterinario(true);
                          setCurrentVeterinario(veterinario);
                          setFormVeterinario(veterinario); // Pre-carga datos en el formulario
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => confirmDeleteVeterinario(veterinario.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <p className="text-sm text-red-500">
                      <span className="font-medium">Teléfono:</span> {veterinario.telefono}
                    </p>
                    <p className="text-sm text-red-500">
                      <span className="font-medium">Especialidad:</span> {veterinario.especialidad}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
