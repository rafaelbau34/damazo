import { NextResponse } from "next/server";
import { AppDataSource } from "app/lib/data-source";
import { Cita } from "app/entities/Cita";

// ✅ Conectar la base de datos antes de cada operación
async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("📌 Base de datos conectada correctamente.");
  }
}

// ✅ Obtener todas las citas (GET /api/citas)
export async function GET() {
  try {
    await connectDB();
    const citaRepository = AppDataSource.getRepository(Cita);
    const citas = await citaRepository.find();

    return NextResponse.json(citas, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo citas:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// ✅ Crear una nueva cita (POST /api/citas)
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.fecha || !data.mascotaId || !data.veterinarioId) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const citaRepository = AppDataSource.getRepository(Cita);
    const nuevaCita = citaRepository.create(data);
    await citaRepository.save(nuevaCita);

    return NextResponse.json(nuevaCita, { status: 201 });
  } catch (error) {
    console.error("Error guardando cita:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
