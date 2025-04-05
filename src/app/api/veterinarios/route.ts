import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// GET: Listar todos los veterinarios
export async function GET() {
  try {
    const veterinarios = await prisma.veterinario.findMany({
      include: { citas: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(veterinarios);
  } catch (error) {
    console.error("❌ Error GET veterinarios:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de veterinarios" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo veterinario
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
    console.error("❌ Error POST veterinario:", error);
    return NextResponse.json(
      { error: "Error al crear el veterinario" },
      { status: 500 }
    );
  }
}
