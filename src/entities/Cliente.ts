import "reflect-metadata"; // IMPORTA ESTO PRIMERO
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ type: "text" })
  direccion: string;

  @Column({ length: 15 })
  telefono: string;

  @Column({ length: 100 })
  email: string;

  @OneToMany(() => Mascota, (mascota) => mascota.cliente)
  mascotas: Mascota[];

  @OneToMany(() => Factura, (factura) => factura.cliente)
  facturas: Factura[];
}
