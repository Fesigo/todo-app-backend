import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(data: CreateTodoDto) {
    return await this.todoRepository.save(this.todoRepository.create(data));
  }

  async findAll() {
    return await this.todoRepository.find();
  }

  async findOneOrFail(options: FindOneOptions<Todo>) {
    try {
      return await this.todoRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, data: UpdateTodoDto) {
    const todo = await this.findOneOrFail({ where: { id } });

    this.todoRepository.merge(todo, data);
    return await this.todoRepository.save(todo);
  }

  async remove(id: string) {
    await this.findOneOrFail({ where: { id } });

    await this.todoRepository.softDelete(id);
  }
}
