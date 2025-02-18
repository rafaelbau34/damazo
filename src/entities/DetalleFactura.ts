import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Factura } from "./Factura";
import { Tratamiento } from "./Tratamiento";

@Entity()
export class DetalleFactura {
    @PrimaryGeneratedColumn()
    id_detalle: number;

    @ManyToOne(() => Factura, factura => factura.detalles)
    factura: Factura;

    @ManyToOne(() => Tratamiento, tratamiento => tratamiento.id_tratamiento)
    tratamiento: Tratamiento;

    @Column()
    cantidad: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    subtotal: number;
}
