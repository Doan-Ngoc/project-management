import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectService } from '../modules/project/services/project.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Get projectId from either params or body
    const projectId = request.params.projectId || request.body.projectId;
    if (!projectId) {
      throw new ForbiddenException('Project ID not found in request');
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
