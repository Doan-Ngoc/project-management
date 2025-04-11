import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './project.entity';
import { WorkingUnit } from '../working-unit/working-unit.entity';
import { Client } from '../client/client.entity';
import { ProjectRepository } from './project.repository';
import { WorkingUnitRepository } from '../working-unit/working-unit.repository';
import { ClientRepository } from '../client/client.repository';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, WorkingUnit, Client]),
    JwtModule,
    PermissionModule,
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository,
    WorkingUnitRepository,
    ClientRepository,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
