import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AccountStatus } from 'src/enum/account-status.enum';
import { Role } from '../role/role.entity';
import { RoleName } from 'src/enum/role.enum';
import { RoleRepository } from '../role/role.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...createUserData } = createUserDto;
    const hashedPassword = this.authService.hashPassword(password);

    const regularRole = await this.roleRepository.findOne({
      where: { name: RoleName.REGULAR },
    });
    if (!regularRole) {
      throw new InternalServerErrorException('Regular role not found');
    }

    const userData = {
      ...createUserData,
      hashed_password: hashedPassword,
      role: regularRole,
      account_status: AccountStatus.PENDING,
    };

    try {
      const newUser = this.userRepository.create(userData);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException();
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }
}
