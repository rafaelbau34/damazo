import "reflect-metadata"; // IMPORTA ESTO PRIMERO Unique }
import {
  Unique,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Cita } from "./Cita";

@Entity()
export class Veterinario {
  @PrimaryGeneratedColumn()
  id_veterinario: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 100 })
  especialidad: string;

  @Column({ length: 15 })
  telefono: string;

  @Column({ length: 100 })
  email: string;

  @OneToMany(() => Cita, (cita) => cita.veterinario)
  citas: Cita[];
}
