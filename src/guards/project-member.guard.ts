import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectService } from '../modules/project/services/project.service';
import { AccountStatus } from '@/enum/account-status.enum';
import { AccountType } from '@/enum/account-type.enum';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Get projectId from either params or body
    const projectId = request.params.projectId || request.body.projectId;
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
