import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import WorkingUnit from '../working-unit/working-unit.entity';
import { Role } from '../role/role.entity';
import { AccountStatus } from '../../enum/account-status.enum';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
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

  @Column()
  account_status: AccountStatus;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'account_role_id' })
  role: Role;

  @ManyToOne(() => WorkingUnit, { nullable: true })
  @JoinColumn({ name: 'working_unit_id' })
  working_unit: WorkingUnit;
}
