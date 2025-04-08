import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = this.authService.hashPassword(password);

    const regularRole = await this.roleRepository.findOne({
      where: { name: RoleName.REGULAR },
    });
    if (!regularRole) {
      throw new InternalServerErrorException('Regular role not found');
    }

    const newUser = {
      ...userData,
      hashed_password: hashedPassword,
      account_role_id: regularRole.id,
      account_status: AccountStatus.PENDING,
    };

    try {
      const user = this.userRepository.create(newUser);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
