import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener todos los veterinarios (GET /api/veterinarios)
export async function GET() {
  try {
    const veterinarios = await prisma.veterinario.findMany({
      include: { citas: true }, // Puedes incluir relaciones según necesites
    });
    return NextResponse.json(veterinarios, { status: 200 });
  } catch (error) {
    console.error("Error al obtener veterinarios:", error);
    return NextResponse.json(
      { error: "Error al obtener veterinarios" },
      { status: 500 }
    );
  }
}

// ✅ Crear un nuevo veterinario (POST /api/veterinarios)
export async function POST(req: Request) {
  try {
    const { nombre, apellido, especialidad, telefono, email } =
      await req.json();

    if (!nombre || !apellido || !especialidad || !telefono || !email) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const nuevoVeterinario = await prisma.veterinario.create({
      data: { nombre, apellido, especialidad, telefono, email },
    });

    return NextResponse.json(nuevoVeterinario, { status: 201 });
  } catch (error) {
    console.error("Error al crear veterinario:", error);
    return NextResponse.json(
      { error: "Error al crear veterinario" },
      { status: 500 }
    );
  }
}
