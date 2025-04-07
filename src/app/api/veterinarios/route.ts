import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// GET: Listar todos los veterinarios
export async function GET() {
  try {
    const veterinarios = await prisma.veterinario.findMany({
      select: {
        // Aquí cambia 'include' por 'select' para especificar qué campos deseas obtener
        id: true,
        nombre: true,
        apellido: true,
        especialidad: true,
        telefono: true,
        email: true,
        // No incluyas 'direccion' si no quieres que se busque
        citas: {
          select: {
            id: true,
          },
        },
      },
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
    console.log("Nuevo veterinario:", {
      nombre,
      apellido,
      especialidad,
      telefono,
      email,
    });

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
