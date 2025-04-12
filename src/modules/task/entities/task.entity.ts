import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '@/databases/base.entity';

export enum TaskStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

@Entity('tasks')
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.IN_PROGRESS,
  })
  status: TaskStatus;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'text', nullable: true })
  deletedReason: string;

  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deleted_by' })
  deletedBy: User;
}
