import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './services/task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Permissions } from 'src/enum/permissions.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { ProjectMemberGuard } from '@/guards/project-member.guard';
import { AddTaskMemberDto } from './dto/add-task-member.dto';
import { RemoveTaskMemberDto } from './dto/remove-task-member.dto';
import { Task } from './entities/task.entity';
import { DeleteTaskDto } from './dto/delete-task.dto';
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //Create new task
  @Post()
  @UseGuards(ProjectMemberGuard)
  @Auth(Permissions.CREATE_TASK)
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.createTask(createTaskDto, user.id);
  }

  @Get(':taskId')
  @UseGuards(ProjectMemberGuard)
  @Auth(Permissions.GET_TASK_BY_ID)
  getTaskById(@Param('taskId') id: string): Promise<Task> {
    return this.taskService.getById(id);
  }

  //Add member to task
  @Post('/members')
  @UseGuards(ProjectMemberGuard)
  @Auth(Permissions.ADD_TASK_MEMBERS)
  addMember(@Body() addTaskMemberDto: AddTaskMemberDto) {
    return this.taskService.addMember(addTaskMemberDto);
  }

  @Delete('/members')
  @UseGuards(ProjectMemberGuard)
  @Auth(Permissions.REMOVE_TASK_MEMBERS)
  removeMember(@Body() removeTaskMemberDto: RemoveTaskMemberDto) {
    return this.taskService.removeMember(removeTaskMemberDto);
  }

  @Delete(':taskId')
  @UseGuards(ProjectMemberGuard)
  @Auth(Permissions.DELETE_TASK)
  async deleteTask(
    @Param('taskId') taskId: string,
    @Body() deleteTaskDto: DeleteTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.deleteTask(taskId, deleteTaskDto, user.id);
  }
}
