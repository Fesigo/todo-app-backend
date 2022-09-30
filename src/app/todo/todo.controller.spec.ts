import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const todoList: Todo[] = [
  new Todo({ id: '1', task: 'task-1', isDone: 0 }),
  new Todo({ id: '2', task: 'task-2', isDone: 0 }),
  new Todo({ id: '3', task: 'task-3', isDone: 0 }),
];

const newTodo = new Todo({ task: 'new-task', isDone: 0 });
const updatedTodo = new Todo({ task: 'task-1', isDone: 1 });

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoList),
            findOneOrFail: jest.fn().mockResolvedValue(todoList[0]),
            create: jest.fn().mockResolvedValue(newTodo),
            update: jest.fn().mockResolvedValue(updatedTodo),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a todo list entity successfully', async () => {
      // Act
      const result = await todoController.findAll();

      // Assert
      expect(result).toEqual(todoList);
      expect(typeof result).toEqual('object');
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should get a todo item successfully', async () => {
      // Act
      const result = await todoController.findOne('1');

      // Assert
      expect(result).toEqual(todoList[0]);
      expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(todoService.findOneOrFail).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(todoService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.findOne('1')).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a new todo item successfully', async () => {
      // Arrange
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      // Act
      const result = await todoController.create(body);

      // Assert
      expect(result).toEqual(newTodo);
      expect(todoService.create).toHaveBeenCalledTimes(1);
      expect(todoService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.create(body)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a todo item successfully', async () => {
      // Arrange
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };

      // Act
      const result = await todoController.update('1', body);

      // Assert
      expect(result).toEqual(updatedTodo);
      expect(todoService.update).toHaveBeenCalledTimes(1);
      expect(todoService.update).toHaveBeenCalledWith('1', body);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should remove a todo item successfully', async () => {
      // Act
      const result = await todoController.remove('1');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(todoService, 'remove').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.remove('1')).rejects.toThrowError();
    });
  });
});
