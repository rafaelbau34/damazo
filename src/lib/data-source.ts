import { Alumno } from "app/entities/Alumnos";
import { Animal } from "app/entities/Animales";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Cita } from "app/entities/Cita";
import { Veterinario } from "app/entities/Veterinario";
import { Tratamiento } from "app/entities/Tratamiento";
import { Factura } from "app/entities/Factura";
import { DetalleFactura } from "app/entities/DetalleFactura";
import { Cliente } from "app/entities/Cliente";
import { Mascota } from "app/entities/Mascota";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    Alumno,
    Animal,
    Cita,
    Veterinario,
    Tratamiento,
    Factura,
    DetalleFactura,
    Cliente,
    Mascota,
  ], // Asegúrate de importar correctamente
});
