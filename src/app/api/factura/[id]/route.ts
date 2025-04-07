import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/factura/[id]
export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const factura = await prisma.factura.findUnique({
      where: { id },
      include: { cliente: true, detalles: true },
    });

    if (!factura) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(factura, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener factura" },
      { status: 500 }
    );
  }
}

// PUT /api/factura/[id]
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const { fecha, total, detalles } = await req.json();
    if (!fecha || total === undefined || !Array.isArray(detalles)) {
      return NextResponse.json(
        { error: "Faltan campos o 'detalles' no es un array" },
        { status: 400 }
      );
    }

    const factura = await prisma.factura.findUnique({ where: { id } });
    if (!factura) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la factura y sus detalles (eliminando los antiguos y creando los nuevos)
    const facturaActualizada = await prisma.factura.update({
      where: { id },
      data: {
        fecha: new Date(fecha),
        total,
        detalles: {
          deleteMany: {}, // Borra todos los detalles previos
          create: detalles,
        },
      },
      include: { cliente: true, detalles: true },
    });

    return NextResponse.json(facturaActualizada, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar factura" },
      { status: 500 }
    );
  }
}

// DELETE /api/factura/[id]
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Verificar si existe la factura
    const factura = await prisma.factura.findUnique({ where: { id } });
    if (!factura) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar primero los detalles asociados a la factura
    await prisma.detalleFactura.deleteMany({ where: { facturaId: id } });

    // Ahora eliminar la factura
    await prisma.factura.delete({ where: { id } });

    return NextResponse.json(
      { message: "Factura eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar factura:", error);
    return NextResponse.json(
      { error: "Error al eliminar factura" },
      { status: 500 }
    );
  }
}
