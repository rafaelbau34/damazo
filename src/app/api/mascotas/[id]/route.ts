import { NextResponse } from "next/server";
import { AppDataSource } from "app/lib/data-source";
import { Mascota } from "app/entities/Mascota";

async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("📌 Base de datos conectada correctamente.");
  }
}

// ✅ Actualizar una mascota por ID (PUT /api/mascotas/:id)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { nombre, especie, raza, edad } = await req.json();
    const id = Number(params.id);

    if (!id || (!nombre && !especie && !raza && edad === undefined)) {
      return NextResponse.json(
        { error: "ID y al menos un campo a actualizar son obligatorios" },
        { status: 400 }
      );
    }

    const mascotaRepository = AppDataSource.getRepository(Mascota);
    const mascota = await mascotaRepository.findOneBy({ id_mascota: id });

    if (!mascota) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    if (nombre) mascota.nombre = nombre;
    if (especie) mascota.especie = especie;
    if (raza) mascota.raza = raza;
    if (edad !== undefined) mascota.edad = edad;

    await mascotaRepository.save(mascota);
    return NextResponse.json(mascota, { status: 200 });
  } catch (error) {
    console.error("Error actualizando mascota:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// ✅ Eliminar una mascota por ID (DELETE /api/mascotas/:id)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID es obligatorio" }, { status: 400 });
    }

    const mascotaRepository = AppDataSource.getRepository(Mascota);
    const mascota = await mascotaRepository.findOneBy({ id_mascota: id });

    if (!mascota) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    await mascotaRepository.remove(mascota);
    return NextResponse.json(
      { message: "Mascota eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error eliminando mascota:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
