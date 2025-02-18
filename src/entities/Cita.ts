import "reflect-metadata"; // IMPORTA ESTO PRIMERO
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

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

  @ManyToOne(() => Mascota, (mascota) => mascota.citas)
  mascota: Mascota;

  @ManyToOne(() => Veterinario, (veterinario) => veterinario.citas)
  veterinario: Veterinario;

  @Column({ type: "datetime" })
  fecha: Date;

  @Column({ type: "text" })
  motivo: string;

  @OneToMany(() => Tratamiento, (tratamiento) => tratamiento.cita)
  tratamientos: Tratamiento[];
}
