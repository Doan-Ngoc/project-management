import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '..';
import { User } from '../entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { AccountStatus } from 'src/enum/account-status.enum';
import { AccountType } from 'src/enum/account-type.enum';
import { RoleService } from '../../role/services/role.service';
import { WorkingUnitService } from '../../working-unit/services/working-unit.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly workingUnitService: WorkingUnitService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, roleId, workingUnitId, ...createUserData } =
      createUserDto;
    const hashedPassword = this.authService.hashPassword(password);
    const role = await this.roleService.getById(roleId);
    const workingUnit = await this.workingUnitService.getById(workingUnitId);

    const userData = {
      ...createUserData,
      role,
      workingUnit,
      hashed_password: hashedPassword,
      account_status: AccountStatus.PENDING,
      account_type: AccountType.MEMBER,
    };

    try {
      const newUser = this.userRepository.create(userData);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail?.includes('username')) {
          throw new ConflictException('Username already exists');
        } else if (error.detail?.includes('email')) {
          throw new ConflictException('Email already exists');
        }
      }
      throw new BadRequestException();
    }
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getUserByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }
}
