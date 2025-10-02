import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/todo.dto';

// Mendefinisikan struktur data untuk sebuah Todo
// Pastikan baris ini ada dan diekspor (export)
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class AppService {
  private todos: Todo[] = [];
  private idCounter = 1;

  /**
   * Pastikan method findAll ini ada.
   */
  findAll(search?: string): Todo[] {
    if (search) {
      return this.todos.filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return this.todos;
  }

  /**
   * Pastikan method create ini ada dan namanya benar.
   * Ini adalah method yang tidak ditemukan menurut pesan error.
   */
  create(createTodoDto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: this.idCounter++,
      title: createTodoDto.title,
      completed: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  /**
   * Pastikan method toggleCompleted ini ada.
   */
  toggleCompleted(id: number): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    todo.completed = !todo.completed;
    return todo;
  }
}
