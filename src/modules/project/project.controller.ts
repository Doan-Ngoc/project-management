import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Permissions } from 'src/enum/permissions.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Auth(Permissions.CREATE_PROJECT)
  create(@Body() createProjectDto: CreateProjectDto, @GetUser() user: User) {
    return this.projectService.create(createProjectDto, user.id);
  }
}
