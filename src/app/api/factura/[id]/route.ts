import prisma from "app/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Obtener factura por ID (GET /api/facturas/:id)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const factura = await prisma.factura.findUnique({
      where: { id },
      include: { cliente: true, detalles: true },
    });

    if (!factura)
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );

    return NextResponse.json(factura, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener factura" },
      { status: 500 }
    );
  }
}

// ✅ Actualizar factura por ID (PUT /api/facturas/:id)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { fecha, total, detalles } = await req.json();

    const factura = await prisma.factura.findUnique({ where: { id } });
    if (!factura)
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );

    const facturaActualizada = await prisma.factura.update({
      where: { id },
      data: {
        fecha: new Date(fecha),
        total,
        detalles: {
          deleteMany: {},
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

// ✅ Eliminar factura por ID (DELETE /api/facturas/:id)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    const factura = await prisma.factura.findUnique({ where: { id } });
    if (!factura)
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );

    await prisma.factura.delete({ where: { id } });

    return NextResponse.json(
      { message: "Factura eliminada correctamente" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar factura" },
      { status: 500 }
    );
  }
}
