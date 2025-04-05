import prisma from 'app/lib/prisma'
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const citas = await prisma.cita.findMany({
      include: {
        mascota: true,
        veterinario: true,
        tratamientos: true,
      },
    });
    return NextResponse.json(citas, { status: 200 });
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return NextResponse.json(
      { error: "Error al obtener citas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { fecha, mascotaId, veterinarioId, motivo } = await req.json();

    // Validación de campos requeridos
    if (!mascotaId || !veterinarioId || !fecha) {
      return NextResponse.json(
        {
          error: "Faltan campos obligatorios: mascotaId, veterinarioId, fecha",
        },
        { status: 400 }
      );
    }

    // Crear la cita
    const cita = await prisma.cita.create({
      data: {
        fecha: new Date(fecha),
        mascotaId: Number(mascotaId),
        veterinarioId: Number(veterinarioId),
        motivo: motivo || null,
      },
      include: {
        mascota: true,
        veterinario: true,
      },
    });

    return NextResponse.json(cita, { status: 201 });
  } catch (error) {
    console.error("Error al crear cita:", error);
    return NextResponse.json(
      { error: "Error al crear cita. Verifica los IDs proporcionados." },
      { status: 500 }
    );
  }
}
