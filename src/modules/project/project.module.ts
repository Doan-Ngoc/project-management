import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './project.entity';
import { WorkingUnit } from '../working-unit/working-unit.entity';
import { Client } from '../client/client.entity';
import { ProjectRepository } from './project.repository';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
import { WorkingUnitModule } from '../working-unit/working-unit.module';
import { ClientModule } from '../client/client.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Project, WorkingUnit, Client]),
    JwtModule,
    PermissionModule,
    WorkingUnitModule,
    ClientModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
