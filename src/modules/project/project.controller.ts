import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Permissions } from 'src/enum/permissions.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Project } from './entities/project.entity';
import { AddProjectMemberDto } from './dtos/add-project-member.dto';
import { ProjectMemberGuard } from '@/guards/project-member.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Auth(Permissions.CREATE_PROJECT)
  create(@Body() createProjectDto: CreateProjectDto, @GetUser() user: User) {
    return this.projectService.create(createProjectDto, user.id);
  }

  @Get(':id')
  getProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectService.getById(id);
  }

  @Post('/members')
  @UseGuards(ProjectMemberGuard)
  @Auth(Permissions.ADD_PROJECT_MEMBERS)
  addMember(@Body() addProjectMemberDto: AddProjectMemberDto) {
    return this.projectService.addMember(addProjectMemberDto);
  }
}
