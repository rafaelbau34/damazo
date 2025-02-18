import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cita } from "./Cita";

@Entity()
export class Tratamiento {
    @PrimaryGeneratedColumn()
    id_tratamiento: number;

    @ManyToOne(() => Cita, cita => cita.tratamientos)
    cita: Cita;

    @Column({ type: "text" })
    descripcion: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    costo: number;
}
