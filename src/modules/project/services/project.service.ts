import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectStatus } from '@/enum/project-status.enum';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { User } from '../../user/entities/user.entity';
import { ProjectRepository } from '../repositories/project.repository';
import { WorkingUnitService } from '../../working-unit/services/working-unit.service';
import { ClientService } from '../../client/services/client.service';
import { UserService } from '../../user/services/user.service';
import { AddProjectMemberDto } from '../dtos/add-project-member.dto';
@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly workingUnitService: WorkingUnitService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const { workingUnitId, clientId, dueDate, ...projectData } =
      createProjectDto;
    if (new Date(dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }
    const workingUnit = await this.workingUnitService.getById(workingUnitId);
    const client = await this.clientService.getById(clientId);
    const user = await this.userService.getById(userId);
    try {
      const project = this.projectRepository.create({
        ...projectData,
        workingUnit,
        client,
        dueDate,
        createdBy: user,
        status: ProjectStatus.ACTIVE,
        //If the creator is a project manager, add them as a project member (not if they are an admin)
        members: user.role?.name === 'pm' ? [user] : [],
      });
      return await this.projectRepository.save(project);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Project name already exists');
      } else {
        console.log(error);
        throw new BadRequestException();
      }
    }
  }

  async getById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['workingUnit', 'members', 'members.role'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async addMember(addProjectMemberDto: AddProjectMemberDto): Promise<Project> {
    const { projectId, userId } = addProjectMemberDto;
    const project = await this.getById(projectId);
    const user = await this.userService.getById(userId);
    // Check if user is already a member
    if (project.members.some((member) => member.id === user.id)) {
      throw new BadRequestException('User is already a member of this project');
    }
    if (user.workingUnit.id !== project.workingUnit.id) {
      throw new BadRequestException(
        'User is not a member of this working unit',
      );
    }
    // Get user's role name
    const roleName = user.role.name;
    // Count current members of the same role
    const currentRoleMembers = project.members.filter(
      (member) => member.role.name === roleName,
    ).length;
    // Check if adding this member would exceed the limit
    if (roleName === 'dev' && currentRoleMembers >= project.devNumber) {
      throw new BadRequestException(
        `Cannot add more developers. Project already has ${project.devNumber} developers.`,
      );
    }
    if (roleName === 'pm' && currentRoleMembers >= project.pmNumber) {
      throw new BadRequestException(
        `Cannot add more project managers. Project already has ${project.pmNumber} project managers.`,
      );
    }
    // Add the member
    project.members = [...project.members, user];
    return await this.projectRepository.save(project);
  }
}
