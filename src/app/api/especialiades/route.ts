// src/app/api/especialidades/route.ts
import { NextResponse } from 'next/server';
import prisma from 'app/lib/prisma';

export async function GET() {
  try {
    const especialidades = await prisma.especialidad.findMany();
    return NextResponse.json(especialidades);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener especialidades" },
      { status: 500 }
    );
  }
}