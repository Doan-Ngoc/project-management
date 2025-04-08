import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleName } from '../../enum/role.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleName,
  })
  name: RoleName;
}
