import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;
}
