// src/services/veterinarioService.ts

// Obtener todos los veterinarios
export async function getVeterinarios() {
  const res = await fetch("/api/veterinarios");
  if (!res.ok) {
    throw new Error("Error al obtener veterinarios");
  }
  return res.json();
}

// Obtener un veterinario por ID
export async function getVeterinario(id: number) {
  const res = await fetch(`/api/veterinarios/${id}`);
  if (!res.ok) {
    throw new Error("Error al obtener el veterinario");
  }
  return res.json();
}

// Crear un nuevo veterinario
export async function createVeterinario(data: {
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  email: string;
}) {
  const res = await fetch("/api/veterinarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error al crear el veterinario");
  }
  return res.json();
}

// Actualizar un veterinario existente
export async function updateVeterinario(
  id: number,
  data: {
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    email: string;
  }
) {
  const res = await fetch(`/api/veterinarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error al actualizar el veterinario");
  }
  return res.json();
}

// Eliminar un veterinario
export async function deleteVeterinario(id: number) {
  const res = await fetch(`/api/veterinarios/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Error al eliminar el veterinario");
  }
  return res.json();
}
