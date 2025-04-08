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
import { AccountStatus } from '../enum/account-status.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  employee_name: string;

  @Column({ type: 'varchar', length: 255 })
  hashed_password: string;

  @Column()
  account_status: AccountStatus;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => WorkingUnit, { nullable: true })
  @JoinColumn({ name: 'working_unit_id' })
  working_unit: WorkingUnit;
}
