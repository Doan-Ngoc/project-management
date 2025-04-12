import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { WorkingUnit } from '../../working-unit/entities/working-unit.entity';
import { Client } from '../../client/entities/client.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '@/databases/base.entity';
export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => WorkingUnit, (unit) => unit.projects)
  @JoinColumn({ name: 'working_unit_id' })
  workingUnit: WorkingUnit;

  @ManyToOne(() => Client, (client) => client.projects)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ type: 'date' })
  startedFrom: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ type: 'integer', nullable: true })
  pm_number: number;

  @Column({ type: 'integer', nullable: true })
  dev_number: number;

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable({
    name: 'project_member',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  members: User[];
}
