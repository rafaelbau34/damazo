import { NextResponse } from "next/server";
import { AppDataSource } from "app/lib/data-source";
import { Mascota } from "app/entities/Mascota";
import { Cliente } from "app/entities/Cliente";

async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("📌 Base de datos conectada correctamente.");
  }
}

// ✅ Obtener todas las mascotas (GET /api/mascotas)
export async function GET() {
  try {
    await connectDB();
    const mascotaRepository = AppDataSource.getRepository(Mascota);
    const mascotas = await mascotaRepository.find({
      relations: ["cliente", "citas"],
    });

    return NextResponse.json(mascotas, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo mascotas:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// ✅ Crear una nueva mascota (POST /api/mascotas)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { nombre, especie, raza, edad, clienteId } = await req.json();

    if (!nombre || !especie || !raza || edad === undefined || !clienteId) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const mascotaRepository = AppDataSource.getRepository(Mascota);
    const clienteRepository = AppDataSource.getRepository(Cliente);

    const cliente = await clienteRepository.findOneBy({
      id_cliente: clienteId,
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    const nuevaMascota = mascotaRepository.create({
      nombre,
      especie,
      raza,
      edad,
      cliente,
    });
    await mascotaRepository.save(nuevaMascota);

    return NextResponse.json(nuevaMascota, { status: 201 });
  } catch (error) {
    console.error("Error guardando mascota:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
