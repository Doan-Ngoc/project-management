import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @IsUUID()
  workingUnitId: string;

  @IsString()
  profilePicture: string;
}
