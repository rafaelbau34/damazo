import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/factura
// Devuelve todas las facturas, incluyendo cliente y detalles
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

// POST /api/factura
// Crea una nueva factura con sus detalles
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
            "Todos los campos son obligatorios y 'detalles' debe ser un array",
        },
        { status: 400 }
      );
    }

    // Verificar que el cliente exista
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });
    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Crear la factura
    const nuevaFactura = await prisma.factura.create({
      data: {
        clienteId,
        fecha: new Date(fecha),
        total,
        detalles: {
          create: detalles, // Crea los detalles de la factura
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
