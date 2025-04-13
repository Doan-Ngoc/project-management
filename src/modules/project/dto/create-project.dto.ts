import {
  IsUUID,
  IsString,
  IsDate,
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

  @IsDate()
  startFrom: Date;

  @IsDate()
  dueDate: Date;

  @IsNumber()
  pmNumber: number;

  @IsNumber()
  devNumber: number;
}
