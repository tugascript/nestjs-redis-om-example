import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@Controller('api/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  public async create(
    @CurrentUser() userId: string,
    @Body() dto: CreateTodoDto,
  ) {
    return this.todosService.create(userId, dto);
  }

  @Get()
  public async findAll(
    @CurrentUser() userId: string,
    @Query('completed') completed?: string,
  ) {
    if (completed) {
      completed = completed.toLowerCase();

      if (completed !== 'true' && completed !== 'false')
        throw new BadRequestException('Invalid completed query parameter');
    }

    return this.todosService.findAll(
      userId,
      completed ? completed === 'true' : null,
    );
  }

  @Get(':id')
  public async findOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.todosService.findOne(userId, id);
  }

  @Patch(':id')
  public async update(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ) {
    return this.todosService.update(userId, id, dto);
  }

  @Delete(':id')
  public async remove(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.todosService.remove(userId, id);
  }
}
