// src/services/clienteService.ts

export async function getClientes() {
  const res = await fetch("/api/clientes");
  if (!res.ok) {
    throw new Error("Error al obtener clientes");
  }
  return res.json();
}
