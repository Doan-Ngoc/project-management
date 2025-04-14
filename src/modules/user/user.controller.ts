import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './services/user.service';
// import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserDto } from './dtos';
import { Auth } from '@/decorators/auth.decorator';
import { Permissions } from '@/enum/permissions.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Auth(Permissions.CREATE_CLIENT)
  @Get()
  getUsers() {
    return 'abc';
  }
}
