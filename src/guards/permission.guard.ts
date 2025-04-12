import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from 'src/decorators/require-permission.decorator';
import { PermissionService } from 'src/modules/permission/services/permission.service';
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const userRole = request.user.role_id;

    const allowedRoles =
      await this.permissionService.getPermissionRoles(requiredPermission);

    return allowedRoles.includes(userRole);
  }
}
