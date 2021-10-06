import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Post,
  Body,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findMany() {
    return await this.usersService.findMany();
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findById(id);
  }

  @Get(':id/orders')
  @HttpCode(HttpStatus.ACCEPTED)
  async findOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOrderByUser(id);
  }

  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return await this.usersService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}
