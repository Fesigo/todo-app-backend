import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexTodoSwagger } from './swagger/index-todo.swagger';
import { CreateTodoSwagger } from './swagger/create-todo.swagger';
import { ShowTodoSwagger } from './swagger/show-todo.swagger';
import { UpdateTodoSwagger } from './swagger/update-todo.swagger';
import { BadRequestSwagger } from '../../helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from '../..//helpers/swagger/not-found.swagger';

@Controller('api/v1/todos')
@ApiTags('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'List all tasks.' })
  @ApiResponse({
    status: 200,
    description: 'Task list returned successfully.',
    type: IndexTodoSwagger,
    isArray: true,
  })
  async findAll() {
    return await this.todoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return a task by Id.' })
  @ApiResponse({
    status: 200,
    description: 'Task data returned successfully.',
    type: ShowTodoSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    type: NotFoundSwagger,
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFail({ where: { id } });
  }

  @Post()
  @ApiOperation({ summary: 'Add a new task.' })
  @ApiResponse({
    status: 201,
    description: 'New Task created successfully.',
    type: CreateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid params.',
    type: BadRequestSwagger,
  })
  async create(@Body() body: CreateTodoDto) {
    return await this.todoService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task.' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully.',
    type: UpdateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid params.',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    type: NotFoundSwagger,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task.' })
  @ApiResponse({
    status: 204,
    description: 'Task deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    type: NotFoundSwagger,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.remove(id);
  }
}
