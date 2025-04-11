import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Entity('working_unit')
export class WorkingUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.workingUnit)
  members: User[];

  @OneToMany(() => Project, (project) => project.workingUnit)
  projects: Project[];
}
