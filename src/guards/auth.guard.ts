import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtService } from '../modules/jwt/jwt.service';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/decorators/require-permission.decorator';
import { PermissionService } from 'src/modules/permission/services/permission.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Authentication check
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const decode = this.jwtService.verify(
      token,
      this.configService.get('JWT_ACCESS_KEY') as string,
    );

    // Authorization check
    const requiredPermission = this.reflector.get<string>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermission) {
      return true;
    }
    const allowedRoleIds =
      await this.permissionService.getPermissionRoles(requiredPermission);
    const userRoleId = decode.role_id;

    if (!allowedRoleIds.includes(userRoleId)) {
      return false;
    }

    return true;
  }
  // }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
