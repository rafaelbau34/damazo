import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// Obtener una cita por ID (GET /api/cita/[id])
export async function GET_BY_ID(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number(context.params.id);
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

// Crear una nueva cita (POST /api/cita/[id])
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

// Actualizar una cita (PATCH /api/cita/[id])
export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const data = await req.json();

    const updatedCita = await prisma.cita.update({
      where: { id },
      data: {
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        mascotaId: data.mascotaId ? Number(data.mascotaId) : undefined,
        veterinarioId: data.veterinarioId
          ? Number(data.veterinarioId)
          : undefined,
        motivo: data.motivo !== undefined ? data.motivo : undefined,
      },
      include: {
        mascota: true,
        veterinario: true,
        tratamientos: true,
      },
    });
    return NextResponse.json(updatedCita, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    return NextResponse.json(
      { error: "Error al actualizar cita" },
      { status: 500 }
    );
  }
}

// Eliminar una cita (DELETE /api/cita/[id])
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    await prisma.cita.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Cita eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    return NextResponse.json(
      { error: "Error al eliminar cita" },
      { status: 500 }
    );
  }
}
