import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener veterinario por ID (GET /api/veterinarios/:id)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const veterinario = await prisma.veterinario.findUnique({
      where: { id },
      include: { citas: true },
    });

    if (!veterinario) {
      return NextResponse.json(
        { error: "Veterinario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(veterinario, { status: 200 });
  } catch (error) {
    console.error("Error al obtener veterinario:", error);
    return NextResponse.json(
      { error: "Error al obtener veterinario" },
      { status: 500 }
    );
  }
}

// ✅ Actualizar veterinario por ID (PUT /api/veterinarios/:id)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { nombre, apellido, especialidad, telefono, email } =
      await req.json();

    const veterinario = await prisma.veterinario.findUnique({ where: { id } });
    if (!veterinario) {
      return NextResponse.json(
        { error: "Veterinario no encontrado" },
        { status: 404 }
      );
    }

    const veterinarioActualizado = await prisma.veterinario.update({
      where: { id },
      data: { nombre, apellido, especialidad, telefono, email },
    });

    return NextResponse.json(veterinarioActualizado, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar veterinario:", error);
    return NextResponse.json(
      { error: "Error al actualizar veterinario" },
      { status: 500 }
    );
  }
}

// ✅ Eliminar veterinario por ID (DELETE /api/veterinarios/:id)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    const veterinario = await prisma.veterinario.findUnique({ where: { id } });
    if (!veterinario) {
      return NextResponse.json(
        { error: "Veterinario no encontrado" },
        { status: 404 }
      );
    }

    await prisma.veterinario.delete({ where: { id } });

    return NextResponse.json(
      { message: "Veterinario eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar veterinario:", error);
    return NextResponse.json(
      { error: "Error al eliminar veterinario" },
      { status: 500 }
    );
  }
}
