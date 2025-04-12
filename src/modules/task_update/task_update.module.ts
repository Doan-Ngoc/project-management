import { Module } from '@nestjs/common';
import { TaskUpdateService } from './services/task_update.service';
import { TaskUpdateController } from './task_update.controller';

@Module({
  controllers: [TaskUpdateController],
  providers: [TaskUpdateService],
})
export class TaskUpdateModule {}
