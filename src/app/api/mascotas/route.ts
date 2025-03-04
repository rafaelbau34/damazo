import { prisma } from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener todas las mascotas (GET /api/mascotas)
export async function GET() {
  try {
    const mascotas = await prisma.mascota.findMany({
      include: { cliente: true, citas: true },
    });
    return NextResponse.json(mascotas, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener mascotas" },
      { status: 500 }
    );
  }
}

// ✅ Crear una nueva mascota (POST /api/mascotas)
export async function POST(req: Request) {
  try {
    const { nombre, especie, raza, edad, clienteId } = await req.json();

    if (!nombre || !especie || !raza || edad === undefined || !clienteId) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });
    if (!cliente)
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );

    const nuevaMascota = await prisma.mascota.create({
      data: { nombre, especie, raza, edad, clienteId },
    });

    return NextResponse.json(nuevaMascota, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear mascota" },
      { status: 500 }
    );
  }
}
