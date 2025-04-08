import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('working_unit')
export default class WorkingUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  name: string;
}
