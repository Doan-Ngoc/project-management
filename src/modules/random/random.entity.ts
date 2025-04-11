import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Random {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
