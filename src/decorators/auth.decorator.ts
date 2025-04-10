import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { Permissions } from 'src/enum/permissions.enum';
import { RequirePermission } from './require-permission.decorator';

export function Auth(permission: Permissions): MethodDecorator {
  return applyDecorators(
    RequirePermission(permission),
    UseGuards(AuthGuard, PermissionGuard),
  );
}
