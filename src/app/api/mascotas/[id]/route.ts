import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener mascota por ID (GET /api/mascotas/:id)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const mascota = await prisma.mascota.findUnique({
      where: { id },
      include: { cliente: true, citas: true },
    });

    if (!mascota)
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );

    return NextResponse.json(mascota, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener mascota" },
      { status: 500 }
    );
  }
}

// ✅ Actualizar mascota por ID (PUT /api/mascotas/:id)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { nombre, especie, raza, edad } = await req.json();

    const mascota = await prisma.mascota.findUnique({ where: { id } });
    if (!mascota)
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );

    const mascotaActualizada = await prisma.mascota.update({
      where: { id },
      data: { nombre, especie, raza, edad },
    });

    return NextResponse.json(mascotaActualizada, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar mascota" },
      { status: 500 }
    );
  }
}

// ✅ Eliminar mascota por ID (DELETE /api/mascotas/:id)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    const mascota = await prisma.mascota.findUnique({ where: { id } });
    if (!mascota)
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );

    await prisma.mascota.delete({ where: { id } });

    return NextResponse.json(
      { message: "Mascota eliminada correctamente" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar mascota" },
      { status: 500 }
    );
  }
}
