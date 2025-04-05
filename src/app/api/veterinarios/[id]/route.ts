"use client";

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
      include: {
        citas: {
          include: { mascota: true }
        },
        especialidades: true
      }
    });

    if (!veterinario) {
      return NextResponse.json(
        { error: "Veterinario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(veterinario, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener veterinario" },
      { status: 500 }
    );
  }
}

// ✅ Actualizar veterinario (PUT /api/veterinarios/:id)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { nombre, apellido, matricula, telefono, email, especialidades } = await req.json();

    const veterinario = await prisma.veterinario.findUnique({ where: { id } });
    if (!veterinario) {
      return NextResponse.json(
        { error: "Veterinario no encontrado" },
        { status: 404 }
      );
    }

    const veterinarioActualizado = await prisma.veterinario.update({
      where: { id },
      data: {
        nombre,
        apellido,
        matricula,
        telefono,
        email,
        especialidades: {
          set: especialidades?.map((id: number) => ({ id })) || []
        }
      },
      include: { especialidades: true }
    });

    return NextResponse.json(veterinarioActualizado, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar veterinario" },
      { status: 500 }
    );
  }
}

// ✅ Eliminar veterinario (DELETE /api/veterinarios/:id)
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
    console.error(error);
    return NextResponse.json(
      { error: "Error al eliminar veterinario" },
      { status: 500 }
    );
  }
}