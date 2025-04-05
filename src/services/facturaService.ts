// src/services/facturaService.ts

// Obtener todas las facturas
export async function getFacturas() {
  const res = await fetch("/api/factura");
  if (!res.ok) {
    throw new Error("Error al obtener facturas");
  }
  return res.json();
}

// Obtener una factura por ID
export async function getFactura(id: number) {
  const res = await fetch(`/api/factura/${id}`);
  if (!res.ok) {
    throw new Error("Error al obtener la factura");
  }
  return res.json();
}

// Crear una nueva factura
// Se espera que 'data' tenga la estructura:
// { clienteId: number, fecha: string, total: number, detalles: Array<{ tratamientoId, cantidad, subtotal }> }
export async function createFactura(data: {
  clienteId: number;
  fecha: string;
  total: number;
  detalles: { tratamientoId: number; cantidad: number; subtotal: number }[];
}) {
  const res = await fetch("/api/factura", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error al crear factura");
  }
  return res.json();
}

// Actualizar una factura existente
export async function updateFactura(
  id: number,
  data: {
    fecha: string;
    total: number;
    detalles: { tratamientoId: number; cantidad: number; subtotal: number }[];
  }
) {
  const res = await fetch(`/api/factura/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error al actualizar factura");
  }
  return res.json();
}

// Eliminar una factura
export async function deleteFactura(id: number) {
  const res = await fetch(`/api/factura/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Error al eliminar factura");
  }
  return res.json();
}
