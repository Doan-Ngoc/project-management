import { Controller, Post, Body } from '@nestjs/common';
// import { UserService } from './services/user.service';
// import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserDto, UserService } from '.';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
