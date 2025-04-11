import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '../user/user.entity';
import { ProjectRepository } from './project.repository';
import { WorkingUnitService } from '../working-unit/working-unit.service';
import { ClientService } from '../client/client.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly workingUnitService: WorkingUnitService,
    private readonly clientService: ClientService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    console.log('userid', userId);
    // const { workingUnitId, clientId, ...projectData } = createProjectDto;
    // const workingUnit = await this.workingUnitService.getById(workingUnitId);
    // const client = await this.clientService.getById(clientId);
    // try {
    //   const project = this.projectRepository.create({
    //     ...projectData,
    //     workingUnit,
    //     client,
    //     status: ProjectStatus.ACTIVE,
    //   });
    //   return await this.projectRepository.save(project);
    // } catch (error) {
    //   if (error.code === '23505') {
    //     throw new ConflictException('Project name already exists');
    //   } else {
    //     throw new InternalServerErrorException();
    //   }
    // }
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
