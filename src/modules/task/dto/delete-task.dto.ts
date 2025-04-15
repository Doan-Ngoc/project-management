import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class DeleteTaskDto {
  // @IsUUID()
  // @IsNotEmpty()
  // taskId: string;

  @IsString()
  @IsNotEmpty()
  deletedReason: string;
}
