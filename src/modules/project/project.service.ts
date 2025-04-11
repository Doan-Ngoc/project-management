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
import { WorkingUnitRepository } from '../working-unit/working-unit.repository';
import { ClientRepository } from '../client/client.repository';
@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly workingUnitRepository: WorkingUnitRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { unitId, clientId, ...projectData } = createProjectDto;

    const workingUnit = await this.workingUnitRepository.findOne({
      where: { id: unitId },
    });

    if (!workingUnit) {
      throw new NotFoundException('Working unit not found');
    }

    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    try {
      const project = this.projectRepository.create({
        ...projectData,
        unit: workingUnit,
        client: client,
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

  // async createUser(createUserDto: CreateUserDto): Promise<User> {
  //   const { password, role_id, ...createUserData } = createUserDto;
  //   const hashedPassword = this.authService.hashPassword(password);

  //   const role = await this.roleRepository.findOne({
  //     where: { id: role_id },
  //   });

  //   if (!role) {
  //     throw new NotFoundException(`Role not found`);
  //   }

  //   const userData = {
  //     ...createUserData,
  //     role,
  //     hashed_password: hashedPassword,
  //     account_status: AccountStatus.PENDING,
  //     account_type: AccountType.MEMBER,
  //   };

  //   try {
  //     const newUser = this.userRepository.create(userData);
  //     return await this.userRepository.save(newUser);
  //   } catch (error) {
  //     if (error.code === '23505') {
  //       throw new ConflictException();
  //     } else {
  //       throw new InternalServerErrorException();
  //     }
  //   }
  // }
}
