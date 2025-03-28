import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener todas las citas (GET /api/citas)
export async function GET() {
  try {
    const citas = await prisma.cita.findMany({
      include: { mascota: true, veterinario: true, tratamientos: true },
    });
    return NextResponse.json(citas, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener citas" },
      { status: 500 }
    );
  }
}

// ✅ Obtener una cita por ID (GET /api/citas/[id])
export async function GET_BY_ID(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const cita = await prisma.cita.findUnique({
      where: { id },
      include: {
        mascota: true, // Relación con Mascota
        veterinario: true, // Relación con Veterinario
        tratamientos: true,
      },
    });

    if (!cita) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(cita, { status: 200 }); // Solo devolver cita
  } catch {
    return NextResponse.json(
      { error: "Error al obtener cita" },
      { status: 500 }
    );
  }
}

// ✅ Crear una nueva cita (POST /api/citas)
export async function POST(req: Request) {
  try {
    const { mascotaId, veterinarioId, fecha, motivo } = await req.json();

    if (!mascotaId || !veterinarioId || !fecha) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    const cita = await prisma.cita.create({
      data: { mascotaId, veterinarioId, fecha, motivo },
    });

    return NextResponse.json(cita, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear cita" }, { status: 500 });
  }
}
