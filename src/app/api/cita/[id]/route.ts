import { NextResponse } from "next/server";
import { AppDataSource } from "app/lib/data-source";
import { Cita } from "app/entities/Cita";

// Conectar la base de datos antes de cada operación
async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("📌 Base de datos conectada correctamente.");
  }
}

// Obtener una cita por ID (GET /api/cita/[id])
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const citaRepository = AppDataSource.getRepository(Cita);
    const cita = await citaRepository.findOneBy({
      id_cita: parseInt(params.id),
    });

    if (!cita) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(cita, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo cita:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// Actualizar una cita por ID (PUT /api/cita/[id])
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { fecha, motivo } = await req.json();

    if (!fecha || !motivo) {
      return NextResponse.json(
        { error: "Fecha y motivo son obligatorios" },
        { status: 400 }
      );
    }

    const citaRepository = AppDataSource.getRepository(Cita);
    const cita = await citaRepository.findOneBy({
      id_cita: parseInt(params.id),
    });

    if (!cita) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    cita.fecha = fecha;
    cita.motivo = motivo;
    await citaRepository.save(cita);

    return NextResponse.json(cita, { status: 200 });
  } catch (error) {
    console.error("Error actualizando cita:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// Eliminar una cita por ID (DELETE /api/cita/[id])
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const citaRepository = AppDataSource.getRepository(Cita);
    const cita = await citaRepository.findOneBy({
      id_cita: parseInt(params.id),
    });

    if (!cita) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    await citaRepository.remove(cita);
    return NextResponse.json({ message: "Cita eliminada" }, { status: 200 });
  } catch (error) {
    console.error("Error eliminando cita:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
