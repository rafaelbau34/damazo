"use client";

import { Layout } from "app/layout/Layout";
import { useState, useEffect } from "react";
import {
  getCitas,
  createCita,
  updateCita,
  deleteCita,
} from "app/services/citaService";
import { getMascotas } from "app/services/mascotaService";
import { getVeterinarios } from "app/services/veterinarioService";
import { useForm, FormProvider, Controller } from "react-hook-form";

// Componentes shadcn/ui
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "app/components/ui/form";
import { Input } from "app/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "app/components/ui/card";
import { Button } from "app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "app/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "app/components/ui/alert-dialog";

// Importa los componentes de tabla de shadcn/ui (ajusta la ruta según tu estructura)
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "app/components/ui/table";

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  clienteId: number;
}

interface Veterinario {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  email: string;
}

interface Tratamiento {
  id: number;
  citaId: number;
  descripcion: string;
  costo: string;
}

export interface Cita {
  id: number;
  fecha: string;
  mascotaId: number;
  veterinarioId: number;
  motivo: string | null;
  mascota: Mascota;
  veterinario: Veterinario;
  tratamientos: Tratamiento[];
}

interface CitaFormValues {
  fecha: string;
  mascotaId: string;
  veterinarioId: string;
  motivo: string;
}

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);

  // AlertDialog para confirmar eliminación
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Formulario para crear cita
  const methods = useForm<CitaFormValues>({
    defaultValues: { fecha: "", mascotaId: "", veterinarioId: "", motivo: "" },
  });

  // Formulario para editar cita
  const editMethods = useForm<CitaFormValues>();

  // Cargar citas
  useEffect(() => {
    (async () => {
      try {
        const data = await getCitas();
        setCitas(data);
      } catch (error) {
        console.error("Error al cargar citas:", error);
      }
    })();
  }, []);

  // Cargar mascotas
  useEffect(() => {
    (async () => {
      try {
        const data = await getMascotas();
        setMascotas(data);
      } catch (error) {
        console.error("Error al cargar mascotas:", error);
      }
    })();
  }, []);

  // Cargar veterinarios
  useEffect(() => {
    (async () => {
      try {
        const data = await getVeterinarios();
        setVeterinarios(data);
      } catch (error) {
        console.error("Error al cargar veterinarios:", error);
      }
    })();
  }, []);

  // Ordenar citas por fecha
  const sortedCitas = [...citas].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  // Crear cita
  const onSubmit = async (data: CitaFormValues) => {
    try {
      const citaCreada = await createCita({
        fecha: data.fecha,
        mascotaId: Number(data.mascotaId),
        veterinarioId: Number(data.veterinarioId),
        motivo: data.motivo || undefined,
      });
      setCitas([...citas, citaCreada]);
      methods.reset();
    } catch (error) {
      console.error("Error al crear la cita:", error);
    }
  };

  // Abrir modal de edición
  const handleEdit = (cita: Cita) => {
    setEditingCita(cita);
    editMethods.reset({
      fecha: cita.fecha.split("T")[0],
      mascotaId: cita.mascota.id.toString(),
      veterinarioId: cita.veterinario.id.toString(),
      motivo: cita.motivo || "",
    });
    setIsEditDialogOpen(true);
  };

  // Guardar cambios de la edición
  const onEditSubmit = async (data: CitaFormValues) => {
    if (!editingCita) return;
    try {
      const updated = await updateCita(editingCita.id, {
        fecha: data.fecha,
        mascotaId: Number(data.mascotaId),
        veterinarioId: Number(data.veterinarioId),
        motivo: data.motivo || undefined,
      });
      setCitas(citas.map((c) => (c.id === editingCita.id ? updated : c)));
      setIsEditDialogOpen(false);
      setEditingCita(null);
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
    }
  };

  // Preparar eliminación
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setAlertDialogOpen(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteCita(deleteId);
      setCitas(citas.filter((c) => c.id !== deleteId));
      setDeleteId(null);
      setAlertDialogOpen(false);
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
    }
  };

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestión de Citas</h1>

        {/* Formulario para agendar nueva cita */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Agendar Nueva Cita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...methods.register("fecha", { required: true })}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Mascota</FormLabel>
                  <FormControl>
                    <Controller
                      control={methods.control}
                      name="mascotaId"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona una mascota" />
                          </SelectTrigger>
                          <SelectContent>
                            {mascotas.map((mascota) => (
                              <SelectItem
                                key={mascota.id}
                                value={mascota.id.toString()}
                              >
                                {mascota.nombre} - {mascota.especie}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Veterinario</FormLabel>
                  <FormControl>
                    <Controller
                      control={methods.control}
                      name="veterinarioId"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un veterinario" />
                          </SelectTrigger>
                          <SelectContent>
                            {veterinarios.map((vet) => (
                              <SelectItem
                                key={vet.id}
                                value={vet.id.toString()}
                              >
                                {vet.nombre} {vet.apellido} - {vet.especialidad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Motivo (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Motivo"
                      {...methods.register("motivo")}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <Button type="submit">Agendar Cita</Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Lista de citas ordenadas por fecha en tabla */}
        <h2 className="text-2xl font-semibold mb-4">Lista de Citas</h2>
        <div className="overflow-x-auto border rounded-md shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Cita #</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Veterinario</TableHead>
                <TableHead>Tratamientos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCitas.map((cita) => (
                <TableRow key={cita.id}>
                  <TableCell className="font-medium">{cita.id}</TableCell>
                  <TableCell>
                    {new Date(cita.fecha).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{cita.motivo || "Sin motivo"}</TableCell>
                  <TableCell>
                    {cita.mascota?.nombre} <br />
                    <span className="text-xs text-muted-foreground">
                      {cita.mascota?.especie}
                    </span>
                  </TableCell>
                  <TableCell>
                    {cita.veterinario?.nombre} {cita.veterinario?.apellido}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {cita.veterinario?.especialidad}
                    </span>
                  </TableCell>
                  <TableCell>
                    {cita.tratamientos && cita.tratamientos.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {cita.tratamientos.map((trat) => (
                          <li key={trat.id}>
                            {trat.descripcion} - ${trat.costo}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Sin tratamientos
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cita)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(cita.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal de edición de cita */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cita #{editingCita?.id}</DialogTitle>
            </DialogHeader>
            <FormProvider {...editMethods}>
              <form
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                className="space-y-4 mt-3"
              >
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...editMethods.register("fecha", { required: true })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Mascota</FormLabel>
                  <FormControl>
                    <Controller
                      control={editMethods.control}
                      name="mascotaId"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una mascota" />
                          </SelectTrigger>
                          <SelectContent>
                            {mascotas.map((mascota) => (
                              <SelectItem
                                key={mascota.id}
                                value={mascota.id.toString()}
                              >
                                {mascota.nombre} - {mascota.especie}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Veterinario</FormLabel>
                  <FormControl>
                    <Controller
                      control={editMethods.control}
                      name="veterinarioId"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un veterinario" />
                          </SelectTrigger>
                          <SelectContent>
                            {veterinarios.map((vet) => (
                              <SelectItem
                                key={vet.id}
                                value={vet.id.toString()}
                              >
                                {vet.nombre} {vet.apellido} - {vet.especialidad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Motivo (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Motivo"
                      {...editMethods.register("motivo")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <DialogFooter>
                  <Button type="submit">Guardar Cambios</Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>

        {/* AlertDialog para confirmar eliminación */}
        <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro que deseas eliminar esta cita? Esta acción no se
                puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
