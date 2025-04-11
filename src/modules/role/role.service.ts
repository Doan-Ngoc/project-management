import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }
}
