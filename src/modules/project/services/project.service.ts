import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { User } from '../../user/entities/user.entity';
import { ProjectRepository } from '../repositories/project.repository';
import { WorkingUnitService } from '../../working-unit/services/working-unit.service';
import { ClientService } from '../../client/services/client.service';
import { UserService } from '../../user/services/user.service';
@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly workingUnitService: WorkingUnitService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const { workingUnitId, clientId, ...projectData } = createProjectDto;
    const workingUnit = await this.workingUnitService.getById(workingUnitId);
    const client = await this.clientService.getById(clientId);
    const user = await this.userService.getById(userId);
    try {
      const project = this.projectRepository.create({
        ...projectData,
        workingUnit,
        client,
        createdBy: user,
        status: ProjectStatus.ACTIVE,
      });
      return await this.projectRepository.save(project);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Project name already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // const workingUnit = await this.workingUnitRepository.findOne({
  //   where: { id: unitId },
  // });

  // if (!workingUnit) {
  //   throw new NotFoundException('Working unit not found');
  // }

  // const client = await this.clientRepository.findOne({
  //   where: { id: clientId },
  // });

  // if (!client) {
  //   throw new NotFoundException('Client not found');
  // }
}
