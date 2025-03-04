import { prisma } from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener todos los clientes (GET /api/clientes)
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      include: { mascotas: true, facturas: true },
    });
    return NextResponse.json(clientes, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

// ✅ Crear un nuevo cliente (POST /api/clientes)
export async function POST(req: Request) {
  try {
    const { nombre, apellido, direccion, telefono, email } = await req.json();

    if (!nombre || !apellido || !telefono || !email) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.create({
      data: { nombre, apellido, direccion, telefono, email },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear cliente" },
      { status: 500 }
    );
  }
}
