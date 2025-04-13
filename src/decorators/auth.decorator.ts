import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Permissions } from 'src/enum/permissions.enum';
import { RequirePermission } from './require-permission.decorator';

export const PERMISSIONS_KEY = 'permission';
export function Auth(permission: Permissions): MethodDecorator {
  return applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permission),
    UseGuards(AuthGuard),
  );
}
