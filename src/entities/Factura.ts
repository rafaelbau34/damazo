import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Cliente } from "./Cliente";
import { DetalleFactura } from "./DetalleFactura";

@Entity()
export class Factura {
  @PrimaryGeneratedColumn()
  id_factura: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.facturas)
  cliente: Cliente;

  @Column({ type: "datetime" })
  fecha: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

<<<<<<< HEAD
  @OneToMany(() => DetalleFactura, (detalle) => detalle.factura)
  detalles: DetalleFactura[];
=======
    @OneToMany(() => DetalleFactura, detalle => detalle.factura)
    detalles: DetalleFactura[];

>>>>>>> 5c372b633b02d686beac3b07f4967117b1dbd167
}
