// src/services/tratamientoService.ts

export async function getTratamientos() {
  const res = await fetch("/api/tratamiento");
  if (!res.ok) {
    throw new Error("Error al obtener tratamientos");
  }
  return res.json();
}
