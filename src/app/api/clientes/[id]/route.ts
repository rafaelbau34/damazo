import { prisma } from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Actualizar un cliente (PUT /api/clientes/[id])
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { nombre, apellido, direccion, telefono, email } = await req.json();

    const cliente = await prisma.cliente.update({
      where: { id: Number(id) },
      data: { nombre, apellido, direccion, telefono, email },
    });

    return NextResponse.json(cliente, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar cliente" },
      { status: 500 }
    );
  }
}

// ✅ Eliminar un cliente (DELETE /api/clientes/[id])
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.cliente.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Cliente eliminado correctamente" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}
