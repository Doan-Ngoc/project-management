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
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //Create new task
  @Post()
  @UseGuards(ProjectMemberGuard)
  @Auth(Permissions.CREATE_TASK)
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.create(createTaskDto, user.id);
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

  // @Get()
  // findAll() {
  //   return this.taskService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.taskService.update(+id, updateTaskDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.taskService.remove(+id);
  // }
}
