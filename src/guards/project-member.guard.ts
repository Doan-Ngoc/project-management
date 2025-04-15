import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from '../modules/project/services/project.service';
import { AccountStatus } from '@/enum/account-status.enum';
import { AccountType } from '@/enum/account-type.enum';
import { TaskService } from '@/modules/task/services/task.service';
@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.body);
    // Get projectId from either params or body
    let projectId = request.params?.projectId || request.body?.projectId;

    // If no direct projectId but has taskId, get project from task
    if (!projectId && request.body.taskId) {
      const task = await this.taskService.getById(request.body.taskId);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      projectId = task.project.id;
    }

    if (!projectId) {
      throw new BadRequestException('Project ID is missing from request');
    }

    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    //Bypass authorization check for admin
    if (user.accountType === AccountType.ADMIN) {
      return true;
    }

    // Get project with its members
    const project = await this.projectService.getById(projectId);

    // Check if user is a member of the project
    const isMember = project.members.some((member) => member.id === user.id);

    if (!isMember) {
      throw new ForbiddenException('User is not a member of this project');
    }

    return true;
  }
}
