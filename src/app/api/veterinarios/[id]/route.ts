// app/api/veterinarios/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from 'app/lib/prisma'; // Asegúrate de tener una instancia de Prisma en esta ruta

// Manejar la actualización de un veterinario
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  const { nombre, apellido, especialidad, telefono, email } = await req.json();

  // Verificar que la ID sea un número válido
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Actualizar el veterinario en la base de datos
    const updatedVeterinario = await prisma.veterinario.update({
      where: { id: idNumber },
      data: {
        nombre,
        apellido,
        especialidad,
        telefono,
        email,
      },
    });

    return NextResponse.json(updatedVeterinario);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar veterinario" }, { status: 500 });
  }
}

// Manejar la eliminación de un veterinario
export async function DELETE(req: Request, context: { params : { id: string } }) {
  const { id } = await context.params;

  // Verificar que la ID sea un número válido
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Eliminar el veterinario de la base de datos
    await prisma.veterinario.delete({
      where: { id: idNumber },
    });

    return NextResponse.json({ message: "Veterinario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar veterinario" }, { status: 500 });
  }
}
