import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;
}
