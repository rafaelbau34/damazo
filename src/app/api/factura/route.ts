import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener todas las facturas (GET /api/facturas)
// Se incluyen tanto el cliente como los detalles de la factura (modelo DetalleFactura)
export async function GET() {
  try {
    const facturas = await prisma.factura.findMany({
      include: { cliente: true, detalles: true },
    });
    return NextResponse.json(facturas, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener facturas" },
      { status: 500 }
    );
  }
}

// ✅ Crear una nueva factura (POST /api/facturas)
// Se espera que en el body se reciba la estructura:
// { clienteId, fecha, total, detalles: [{ tratamientoId, cantidad, subtotal }, ...] }
export async function POST(req: Request) {
  try {
    const { clienteId, fecha, total, detalles } = await req.json();

    if (
      !clienteId ||
      !fecha ||
      total === undefined ||
      !detalles ||
      !Array.isArray(detalles)
    ) {
      return NextResponse.json(
        {
          error:
            "Todos los campos son obligatorios y detalles debe ser un array",
        },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });
    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    const nuevaFactura = await prisma.factura.create({
      data: {
        clienteId,
        fecha: new Date(fecha),
        total,
        // Aquí se crean los registros en el modelo DetalleFactura asociados a esta factura
        detalles: {
          create: detalles,
        },
      },
      include: { cliente: true, detalles: true },
    });

    return NextResponse.json(nuevaFactura, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear factura" },
      { status: 500 }
    );
  }
}
