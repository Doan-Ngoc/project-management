import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { ProjectService } from '../../project/services/project.service';
import { UserService } from '../../user/services/user.service';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule';
import { TaskStatus } from '@/enum/task-status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const { projectId, dueDate, ...taskData } = createTaskDto;
    const project = await this.projectService.getById(projectId);
    const user = await this.userService.getById(userId);

    // Check if due date is in the past
    if (dueDate && new Date(dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    // Create the task
    const newTask = this.taskRepository.create({
      ...taskData,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      project,
      createdBy: user,
    });

    return await this.taskRepository.save(newTask);
  }

  //Every midnight: Update task status to expired if due date is passed
  @Cron(CronExpression.EVERY_MINUTE, {
    // timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleExpiredTasks() {
    try {
      console.log('Cron started');
      const now = new Date();

      const result = await this.taskRepository
        .createQueryBuilder()
        .update(Task)
        .set({ status: TaskStatus.EXPIRED })
        .where('dueDate < :now', { now })
        .andWhere(`status = :status`, {
          status: TaskStatus.IN_PROGRESS,
        })
        .execute();

      console.log(`${result.affected} task(s) marked as expired.`);
    } catch (err) {
      console.error('Cron job error:', err);
    }
  }
}
