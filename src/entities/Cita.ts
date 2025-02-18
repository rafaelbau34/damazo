import "reflect-metadata"; // IMPORTA ESTO PRIMERO
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Mascota } from "./Mascota";
import { Veterinario } from "./Veterinario";
import { Tratamiento } from "./Tratamiento";

@Entity()
export class Cita {
  @PrimaryGeneratedColumn()
  id_cita: number;

  @ManyToOne(() => Mascota, (mascota: Mascota) => mascota.citas)
  mascota: Mascota;

  @ManyToOne(() => Veterinario, (veterinario: Veterinario) => veterinario.citas)
  veterinario: Veterinario;

  @Column({ type: "datetime" })
  fecha: Date;

  @Column({ type: "text" })
  motivo: string;

  @OneToMany(() => Tratamiento, (tratamiento: Tratamiento) => tratamiento.cita)
  tratamientos: Tratamiento[];
}
