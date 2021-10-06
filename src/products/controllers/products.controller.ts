import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateProductDto, UpdateProductDto } from '../dtos/products.dto';
import { ProductsService } from '../services/products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findMany() {
    return await this.productsService.findMany();
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findById(id);
  }

  @Post()
  async create(@Body() payload: CreateProductDto) {
    return await this.productsService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductDto,
  ) {
    return await this.productsService.update(id, payload);
  }

  @Put(':id/category/:categoryId')
  async addCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return await this.productsService.addCategoryByProduct(id, categoryId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }

  @Delete(':id/category/:categoryId')
  async removeCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return await this.productsService.removeCategoryByProduct(id, categoryId);
  }
}
