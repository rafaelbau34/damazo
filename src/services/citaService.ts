interface NuevaCita {
  fecha: string;
  mascotaId: number;
  veterinarioId: number;
  motivo?: string; // Opcional
}

export async function getCitas() {
  const response = await fetch("/api/cita");
  if (!response.ok) {
    throw new Error("Error al obtener citas");
  }
  return response.json();
}

export async function createCita(data: NuevaCita) {
  const response = await fetch("/api/cita", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear cita");
  }
  return response.json();
}

export async function updateCita(id: number, data: Partial<NuevaCita>) {
  const response = await fetch(`/api/cita/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar cita");
  }
  return response.json();
}

export async function deleteCita(id: number) {
  const response = await fetch(`/api/cita/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar cita");
  }
  return response.json();
}
