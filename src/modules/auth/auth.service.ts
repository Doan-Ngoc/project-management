import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthLogInDto } from './dto/authLogIn.dto';
import { UserService } from '@/modules/user/services/user.service';
import { JwtService } from 'src/modules/jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  hashPassword(password: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  comparePassword(receivedPassword: string, hashedPassword: string) {
    return bcrypt.compare(receivedPassword, hashedPassword);
  }

  async logIn(authLogInDto: AuthLogInDto) {
    const { username, password } = authLogInDto;
    const user = await this.userService.getUserByUserName(username);
    const checkPassword = await this.comparePassword(
      password,
      user.hashed_password,
    );
    if (!checkPassword) throw new BadRequestException('Password incorrect');

    return {
      accessToken: this.jwtService.sign(
        { id: user.id, role_id: user.role.id },
        this.configService.get('JWT_ACCESS_KEY') as string,
        {
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
        },
      ),
    };
  }
}
