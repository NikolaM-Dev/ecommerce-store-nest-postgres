import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  HttpStatus,
  HttpCode,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customers.dto';
import { CustomersService } from '../services/customers.service';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  async findMany() {
    return await this.customersService.findMany();
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.customersService.findById(id);
  }

  @Post()
  async create(@Body() payload: CreateCustomerDto) {
    return await this.customersService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
  ) {
    return await this.customersService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.customersService.remove(id);
  }
}
