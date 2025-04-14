import {
  IsUUID,
  IsString,
  IsDateString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsUUID()
  workingUnitId: string;

  @IsUUID()
  clientId: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  pmNumber: number;

  @IsNumber()
  devNumber: number;
}
