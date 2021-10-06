import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { CreateOrderDto, UpdateOrderDto } from '../dtos/orders.dto';
import { OrdersService } from '../services/orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findMany() {
    return await this.ordersService.findMany();
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.findById(id);
  }

  @Post()
  async create(@Body() payload: CreateOrderDto) {
    return await this.ordersService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderDto,
  ) {
    return await this.ordersService.update(id, payload);
  }

  @Delete('id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.remove(id);
  }
}
