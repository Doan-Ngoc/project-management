import {
  Injectable,
  BadRequestException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { ProjectService } from '../../project/services/project.service';
import { UserService } from '../../user/services/user.service';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule';
import { TaskStatus } from '@/enum/task-status.enum';
import { AddTaskMemberDto } from '../dto/add-task-member.dto';
import { AccountStatus } from '@/enum/account-status.enum';
import { RemoveTaskMemberDto } from '../dto/remove-task-member.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async getById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'members', 'members.role'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

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

  //Add member to task
  async addMember(addTaskMemberDto: AddTaskMemberDto): Promise<Task> {
    const { taskId, userId } = addTaskMemberDto;

    // Get task with its project and members
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: ['project', 'project.members', 'members', 'members.role'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check task status
    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.EXPIRED
    ) {
      throw new BadRequestException(
        'Cannot add members to a completed or expired task',
      );
    }

    const user = await this.userService.getById(userId);
    //Check if user account is active
    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new BadRequestException('User account is not active');
    }
    // Check if user is already assigned to the task
    if (task.members.some((member) => member.id === user.id)) {
      throw new BadRequestException('User is already assigned to this task');
    }

    // Check if user is a member of the project
    if (!task.project.members.some((member) => member.id === user.id)) {
      throw new BadRequestException('User is not a member of the project');
    }

    // Add the member
    task.members = [...task.members, user];
    return await this.taskRepository.save(task);
  }

  async removeMember(removeTaskMemberDto: RemoveTaskMemberDto): Promise<Task> {
    const { taskId, userId } = removeTaskMemberDto;
    const task = await this.getById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check task status
    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.EXPIRED
    ) {
      throw new BadRequestException(
        'Cannot remove members from a completed or expired task',
      );
    }

    const user = await this.userService.getById(userId);

    // Check if user is a member of the task
    const isMember = task.members.some((member) => member.id === user.id);
    if (!isMember) {
      throw new BadRequestException('User is not a member of this task');
    }

    // Remove the member
    task.members = task.members.filter((member) => member.id !== user.id);
    return await this.taskRepository.save(task);
  }
}
