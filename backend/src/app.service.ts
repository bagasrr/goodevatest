import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/todo.dto';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class AppService {
  private todos: Todo[] = [];
  private idCounter = 1;

  findAll(search?: string): Todo[] {
    if (search) {
      return this.todos.filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return this.todos;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: this.idCounter++,
      title: createTodoDto.title,
      completed: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  toggleCompleted(id: number): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    todo.completed = !todo.completed;
    return todo;
  }
}
