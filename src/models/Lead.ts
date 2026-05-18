
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum FuenteLead {
  INSTAGRAM = "instagram",
  FACEBOOK = "facebook",
  LANDING_PAGE = "landing_page",
  REFERIDO = "referido",
  OTRO = "otro",
}

@Entity('leads')
export class Lead {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ length: 150, type: 'varchar' })
  nombre: string;

  @Column({ length: 255, unique: true, type: 'varchar' })
  email: string;

  @Column({ length: 50, nullable: true, type: 'varchar' })
  telefono: string | null;

  @Column({ type: 'enum', enum: FuenteLead })
  fuente: FuenteLead;

  @Column({ length: 150, nullable: true , name: 'producto_interes', type: 'varchar' })
  productoInteres: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  presupuesto: number | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;
}