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
    // Di sini kita mungkin perlu menangani kasus jika todo tidak ditemukan
    return this.appService.toggleCompleted(id);
  }
}
