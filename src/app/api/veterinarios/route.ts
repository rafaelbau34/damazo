//GET POST
import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener todos los veterinarios (GET /api/veterinarios)
export async function GET() {
  try {
    const veterinarios = await prisma.veterinario.findMany({
      include: {
        citas: true,
        especialidades: true
      },
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(veterinarios, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener veterinarios" },
      { status: 500 }
    );
  }
}

// ✅ Crear nuevo veterinario (POST /api/veterinarios)
export async function POST(req: Request) {
  try {
    const { nombre, apellido, matricula, telefono, email, especialidades } = await req.json();

    if (!nombre || !apellido || !matricula) {
      return NextResponse.json(
        { error: "Nombre, apellido y matrícula son obligatorios" },
        { status: 400 }
      );
    }

    const nuevoVeterinario = await prisma.veterinario.create({
      data: {
        nombre,
        apellido,
        matricula,
        telefono,
        email,
        especialidades: {
          connect: especialidades?.map((id: number) => ({ id })) || []
        }
      },
      include: { especialidades: true }
    });

    return NextResponse.json(nuevoVeterinario, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear veterinario" },
      { status: 500 }
    );
  }
}