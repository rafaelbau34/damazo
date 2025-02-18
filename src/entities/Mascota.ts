import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Cliente } from "./Cliente";
import { Cita } from "./Cita";

@Entity()
export class Mascota {
  @PrimaryGeneratedColumn()
  id_mascota: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  especie: string;

  @Column({ length: 50 })
  raza: string;

  @Column()
  edad: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.mascotas)
  cliente: Cliente;

  @OneToMany(() => Cita, (cita) => cita.mascota)
  citas: Cita[];
}
