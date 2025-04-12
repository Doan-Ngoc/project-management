import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from '.';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
