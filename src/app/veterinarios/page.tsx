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
} from "app/components/ui/card";
import { Label } from "app/components/ui/label";
import { Input } from "app/components/ui/input";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "app/components/ui/alert-dialog";
import { Skeleton } from "app/components/ui/skeleton";
import { motion } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
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
      setFormVeterinario({ nombre: "", apellido: "", telefono: "", email: "", especialidad: "" });
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
      setFormVeterinario({ nombre: "", apellido: "", telefono: "", email: "", especialidad: "" });
      setIsUpdatingVeterinario(false);
      setCurrentVeterinario(null);
      fetchVeterinarios();
    } catch (error) {
      console.error(error);
    }
  }

  function confirmDeleteVeterinario(id: number) {
    setDeleteDialog({ open: true, id, message: "¿Estás seguro de que deseas eliminar este veterinario?" });
  }

  async function handleDeleteConfirmed() {
    try {
      const res = await fetch(`/api/veterinarios/${deleteDialog.id}`, { method: "DELETE" });
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
      {/* Fondo dinámico animado */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-red-100 via-pink-200 to-red-300 animate-gradient bg-[length:400%_400%]"></div>

      <div className="p-6 max-w-7xl mx-auto pt-20">
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
              <AlertDialogDescription>{deleteDialog.message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirmed}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex justify-center items-center mb-6">
          <motion.h1
            whileHover={{ scale: 1.1, color: "#b91c1c", textShadow: "0px 4px 15px rgba(0,0,0,0.7)" }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-green-700"
          >
            Gestión de Veterinarios
          </motion.h1>
        </div>

        <div className="flex justify-center mb-4">
          <Button
            variant="default"
            onClick={() => setIsAddingVeterinario(!isAddingVeterinario)}
            className="bg-red-400 hover:bg-red-700 shadow-md hover:shadow-xl transition duration-500"
          >
            {isAddingVeterinario ? "Cancelar" : "Agregar Veterinario"}
          </Button>
        </div>

        {(isAddingVeterinario || isUpdatingVeterinario) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Card className="mt-4 border-red-900 bg-white/60 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle>
                  {isUpdatingVeterinario ? "Actualizar Veterinario" : "Nuevo Veterinario"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={isUpdatingVeterinario ? handleUpdateVeterinario : handleSubmitVeterinario}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["nombre", "apellido", "telefono", "email", "especialidad"].map((field) => (
                      <div key={field}>
                        <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                        <Input
                          type={field === "email" ? "email" : "text"}
                          value={(formVeterinario as any)[field]}
                          onChange={(e) => setFormVeterinario({ ...formVeterinario, [field]: e.target.value })}
                          required
                          className="border-red-600 focus:ring-red-600 bg-white/80 hover:shadow-lg transition duration-300"
                        />
                      </div>
                    ))}
                  </div>
                  <Button type="submit" className="mt-2 bg-red-600 hover:bg-red-700 shadow-md hover:shadow-xl">
                    {isUpdatingVeterinario ? "Actualizar" : "Guardar Veterinario"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))
          ) : (
            veterinarios.map((veterinario) => (
              <motion.div
                key={veterinario.id}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="flex flex-col h-full border-pink-600 bg-white/70 backdrop-blur-md transition-all duration-300 hover:bg-red-100 hover:border-red-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-black">
                          {veterinario.nombre} {veterinario.apellido}
                        </CardTitle>
                        <CardDescription className="mt-2 text-green-600">
                          {veterinario.email}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-black hover:text-black"
                          onClick={() => {
                            setIsUpdatingVeterinario(true);
                            setCurrentVeterinario(veterinario);
                            setFormVeterinario(veterinario);
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
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
