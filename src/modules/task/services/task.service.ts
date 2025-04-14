import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task, TaskStatus } from '../entities/task.entity';
import { ProjectService } from '../../project/services/project.service';
import { UserService } from '../../user/services/user.service';

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

    // Get project
    const project = await this.projectService.getById(projectId);

    // Get user and check if they are a project member
    const user = await this.userService.getById(userId);
    const isMember = project.members.some((member) => member.id === user.id);
    if (!isMember) {
      throw new BadRequestException('User is not a member of this project');
    }

    // Check if due date is in the past
    if (dueDate && new Date(dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    // Create the task
    const newTask = this.taskRepository.create({
      ...taskData,
      dueDate,
      status: TaskStatus.IN_PROGRESS,
      project,
      createdBy: user,
    });
    // const task = new Task();
    // task.name = name;
    // task.description = description || '';
    // task.dueDate = dueDate ? new Date(dueDate) : new Date();
    // task.project = project;
    // task.createdBy = user;
    // task.status = TaskStatus.IN_PROGRESS;

    return await this.taskRepository.save(newTask);
  }

  // findAll() {
  //   return `This action returns all task`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  // update(id: number, updateTaskDto: UpdateTaskDto) {
  //   return `This action updates a #${id} task`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
