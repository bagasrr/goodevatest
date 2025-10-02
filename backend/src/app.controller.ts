import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
// Import 'Todo' sebagai tipe, bukan value
import type { Todo } from './app.service';
import { CreateTodoDto } from './dto/todo.dto';

@Controller('api/todos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll(@Query('search') search?: string): Todo[] {
    return this.appService.findAll(search);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: Request): Todo {
    console.log(`Request received from user ID: ${req.headers['x-user-id']}`);
    console.log('Request body:', createTodoDto);
    return this.appService.create(createTodoDto);
  }

  @Patch(':id')
  toggleCompleted(@Param('id', ParseIntPipe) id: number): Todo {
    if (!id) {
      throw new Error('ID is required');
    }
    console.log(`Toggling completion status for todo ID: ${id}`);
    return this.appService.toggleCompleted(id);
  }
}
