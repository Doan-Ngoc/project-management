import { SetMetadata } from '@nestjs/common';
import { Permissions } from '../enum/permissions.enum';

export const PERMISSIONS_KEY = 'permission';
export const RequirePermission = (permission: Permissions) =>
  SetMetadata(PERMISSIONS_KEY, permission);
