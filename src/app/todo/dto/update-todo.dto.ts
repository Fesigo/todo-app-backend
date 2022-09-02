import { IsIn, IsNotEmpty } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends CreateTodoDto {
  @IsNotEmpty()
  task: string;

  @IsNotEmpty()
  @IsIn([0, 1])
  isDone: number;
}
