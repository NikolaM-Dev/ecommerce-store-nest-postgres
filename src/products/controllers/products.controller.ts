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
  Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/products.dto';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { ProductsService } from '../services/products.service';
import { Public, Roles } from '../../auth/decorators';
import { Role } from '../../auth/models';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  async findMany(@Query() params: FilterProductsDto) {
    return await this.productsService.findMany(params);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() payload: CreateProductDto) {
    return await this.productsService.create(payload);
  }

  @Roles(Role.ADMIN)
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
