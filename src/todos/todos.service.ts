import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Repository } from 'redis-om';
import { RedisClientService } from '../redis-client/redis-client.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, todoSchema } from './entities/todo.entity';

@Injectable()
export class TodosService implements OnModuleInit {
  private readonly todosRepository: Repository<Todo>;

  constructor(private readonly redisClient: RedisClientService) {
    this.todosRepository = redisClient.fetchRepository(todoSchema);
  }

  public async create(userId: string, { body }: CreateTodoDto): Promise<Todo> {
    const todo = await this.todosRepository.createAndSave({
      body,
      completed: false,
      createdAt: new Date(),
      author: userId,
    });
    return todo;
  }

  public async update(
    userId: string,
    todoId: string,
    { body, completed }: UpdateTodoDto,
  ): Promise<Todo> {
    const todo = await this.findOne(userId, todoId);

    if (body && todo.body !== body) todo.body = body;
    if (completed) {
      const boolComplete = completed.toLowerCase() === 'true';
      if (todo.completed !== boolComplete) todo.completed = boolComplete;
    }

    await this.todosRepository.save(todo);
    return todo;
  }

  public async findAll(userId: string, completed?: boolean): Promise<Todo[]> {
    const qb = this.todosRepository.search().where('author').equals(userId);

    if (completed !== null) {
      qb.where('completed').equals(completed);
    }

    return qb.all();
  }

  public async findOne(userId: string, todoId: string): Promise<Todo> {
    const todo = await this.todosRepository.fetch(todoId);

    if (!todo || todo.author !== userId)
      throw new NotFoundException('Todo not found');

    return todo;
  }

  public async remove(userId: string, todoId: string): Promise<string> {
    const todo = await this.findOne(userId, todoId);
    await this.todosRepository.remove(todo.entityId);
    return 'Todo removed successfully';
  }

  public async onModuleInit() {
    await this.todosRepository.createIndex();
  }
}
