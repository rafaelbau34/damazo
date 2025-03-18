import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener todos los tratamientos (GET /api/tratamientos)
export async function GET() {
  try {
    const tratamientos = await prisma.tratamiento.findMany({
      include: { detalles: true, cita: true },
    });
    return NextResponse.json(tratamientos, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener tratamientos" },
      { status: 500 }
    );
  }
}

// ✅ Obtener un tratamiento por ID (GET /api/tratamientos/[id])
export async function GET_BY_ID(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const tratamiento = await prisma.tratamiento.findUnique({
      where: { id },
      include: { detalles: true, cita: true },
    });

    if (!tratamiento) {
      return NextResponse.json(
        { error: "Tratamiento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(tratamiento, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener tratamiento" },
      { status: 500 }
    );
  }
}

// ✅ Crear un nuevo tratamiento (POST /api/tratamientos)
export async function POST(req: Request) {
  try {
    const { citaId, descripcion, costo } = await req.json();

    if (!citaId || !costo) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    const tratamiento = await prisma.tratamiento.create({
      data: { citaId, descripcion, costo },
    });

    return NextResponse.json(tratamiento, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear tratamiento" },
      { status: 500 }
    );
  }
}
