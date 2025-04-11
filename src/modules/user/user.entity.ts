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
import { WorkingUnit } from '../working-unit/working-unit.entity';
import { Role } from '../role/role.entity';
import { AccountStatus } from '../../enum/account-status.enum';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { AccountType } from '../../enum/account-type.enum';
import { Project } from '../project/project.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  hashed_password: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  employee_name: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  account_type: AccountType;

  @Column({
    type: 'enum',
    enum: AccountStatus,
  })
  account_status: AccountStatus;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
    onDelete: 'CASCADE',
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
}
