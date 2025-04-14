import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { WorkingUnit } from '../../working-unit/entities/working-unit.entity';
import { Role } from '../../role/entities/role.entity';
import { AccountStatus } from '../../../enum/account-status.enum';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { AccountType } from '../../../enum/account-type.enum';
import { Project } from '../../project/entities/project.entity';
import { BaseEntity } from '@/databases/base.entity';
import { Task } from '@/modules/task/entities/task.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  hashed_password: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  employee_name: string;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.MEMBER,
  })
  account_type: AccountType;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  account_status: AccountStatus;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
    nullable: true
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => WorkingUnit, (workingUnit) => workingUnit.members, {
    nullable: true,
  })
  @JoinColumn({ name: 'working_unit_id' })
  workingUnit: WorkingUnit;

  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[];

  @ManyToMany(() => Task, (task) => task.members)
  tasks: Task[];
}
