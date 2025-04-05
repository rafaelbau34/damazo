// src/services/mascotaService.ts

// Obtener todas las mascotas
export async function getMascotas() {
  const res = await fetch("/api/mascotas");
  if (!res.ok) {
    throw new Error("Error al obtener mascotas");
  }
  return res.json();
}

// Obtener una mascota por ID
export async function getMascota(id: number) {
  const res = await fetch(`/api/mascotas/${id}`);
  if (!res.ok) {
    throw new Error("Error al obtener la mascota");
  }
  return res.json();
}

// Crear una nueva mascota
export async function createMascota(data: {
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  clienteId: number;
}) {
  const res = await fetch("/api/mascotas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error al crear la mascota");
  }
  return res.json();
}

// Actualizar una mascota existente
export async function updateMascota(
  id: number,
  data: { nombre: string; especie: string; raza: string; edad: number }
) {
  const res = await fetch(`/api/mascotas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error al actualizar la mascota");
  }
  return res.json();
}

// Eliminar una mascota
export async function deleteMascota(id: number) {
  const res = await fetch(`/api/mascotas/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Error al eliminar la mascota");
  }
  return res.json();
}
