import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @IsString()
  @IsNotEmpty()
  role_id: string;

  @IsString()
  @IsNotEmpty()
  working_unit_id: string;

  @IsString()
  profile_picture: string;
}
