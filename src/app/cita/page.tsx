"use client";

import { Layout } from "app/layout/Layout";
import { useState, useEffect } from "react";
import { getCitas, createCita } from "app/services/citaService";
import { getMascotas } from "app/services/mascotaService";
import { getVeterinarios } from "app/services/veterinarioService";

// Importa react-hook-form y el Controller para componentes controlados
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
  CardContent,
  CardHeader,
  CardTitle,
} from "app/components/ui/card";
import { Button } from "app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app/components/ui/select";

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

interface Cita {
  id: number;
  fecha: string;
  mascotaId: number;
  veterinarioId: number;
  motivo: string | null;
  mascota: Mascota;
  veterinario: Veterinario;
  tratamientos: Tratamiento[];
}

// Valores del formulario
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

  // Inicializa react-hook-form
  const methods = useForm<CitaFormValues>({
    defaultValues: {
      fecha: "",
      mascotaId: "",
      veterinarioId: "",
      motivo: "",
    },
  });

  // Obtiene las citas
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

  // Obtiene las mascotas
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

  // Obtiene los veterinarios
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

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestión de Citas</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Agendar Nueva Cita</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Campo de Fecha */}
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...methods.register("fecha", { required: true })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                {/* Select para Mascota */}
                <FormItem>
                  <FormLabel>Mascota</FormLabel>
                  <FormControl>
                    <Controller
                      control={methods.control}
                      name="mascotaId"
                      rules={{ required: true }}
                      render={({
                        field,
                      }: {
                        field: {
                          onChange: (value: string) => void;
                          value: string;
                        };
                      }) => (
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

                {/* Select para Veterinario */}
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

                {/* Campo de Motivo (opcional) */}
                <FormItem>
                  <FormLabel>Motivo (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Motivo"
                      {...methods.register("motivo")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <Button type="submit" className="mt-4">
                  Agendar Cita
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Lista de citas */}
        <h2 className="text-2xl font-semibold mb-4">Lista de Citas</h2>
        <div className="grid grid-cols-1 gap-6">
          {citas.map((cita) => (
            <Card key={cita.id}>
              <CardHeader>
                <CardTitle>Cita #{cita.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(cita.fecha).toLocaleDateString()}
                </p>
                <p>
                  <strong>Motivo:</strong> {cita.motivo || "Sin motivo"}
                </p>

                <div className="mt-4">
                  <h3 className="font-semibold">Mascota</h3>
                  <p>
                    <strong>Nombre:</strong> {cita.mascota?.nombre}
                  </p>
                  <p>
                    <strong>Especie:</strong> {cita.mascota?.especie}
                  </p>
                  <p>
                    <strong>Raza:</strong> {cita.mascota?.raza}
                  </p>
                  <p>
                    <strong>Edad:</strong> {cita.mascota?.edad}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold">Veterinario</h3>
                  <p>
                    <strong>Nombre:</strong> {cita.veterinario?.nombre}{" "}
                    {cita.veterinario?.apellido}
                  </p>
                  <p>
                    <strong>Especialidad:</strong>{" "}
                    {cita.veterinario?.especialidad}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {cita.veterinario?.telefono}
                  </p>
                  <p>
                    <strong>Email:</strong> {cita.veterinario?.email}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold">Tratamientos</h3>
                  {cita.tratamientos && cita.tratamientos.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {cita.tratamientos.map((tratamiento) => (
                        <li key={tratamiento.id}>
                          {tratamiento.descripcion} - ${tratamiento.costo}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay tratamientos registrados</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
