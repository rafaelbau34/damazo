import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// GET: Obtener un veterinario por ID
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

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

    return NextResponse.json(veterinario);
  } catch (error) {
    console.error("❌ Error GET veterinario:", error);
    return NextResponse.json(
      { error: "Error al obtener veterinario" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un veterinario por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const data = await req.json();

    const veterinario = await prisma.veterinario.findUnique({ where: { id } });
    if (!veterinario) {
      return NextResponse.json(
        { error: "Veterinario no encontrado" },
        { status: 404 }
      );
    }

    const actualizado = await prisma.veterinario.update({
      where: { id },
      data,
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error("❌ Error PUT veterinario:", error);
    return NextResponse.json(
      { error: "Error al actualizar veterinario" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un veterinario por ID
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const veterinario = await prisma.veterinario.findUnique({ where: { id } });
    if (!veterinario) {
      return NextResponse.json(
        { error: "Veterinario no encontrado" },
        { status: 404 }
      );
    }

    await prisma.veterinario.delete({ where: { id } });

    return NextResponse.json({ message: "Veterinario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error DELETE veterinario:", error);
    return NextResponse.json(
      { error: "Error al eliminar veterinario" },
      { status: 500 }
    );
  }
}
