import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, Between } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { Category } from '../entities/category.entity';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/products.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async findMany(params?: FilterProductsDto) {
    if (!params)
      return await this.productRepository.find({ relations: ['brand'] });

    const { limit: take, offset: skip, minPrice, maxPrice } = params;
    const where: FindConditions<Product> = {};

    if (minPrice && maxPrice) where.price = Between(minPrice, maxPrice);

    return this.productRepository.find({
      relations: ['brand'],
      where,
      take,
      skip,
    });
  }

  async findById(id: number) {
    const product = await this.productRepository.findOne(id, {
      relations: ['brand', 'categories'],
    });

    if (!product)
      throw new NotFoundException(
        `Product with id ${id} not found in database`,
      );

    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = this.productRepository.create(payload);

    if (payload.brandId) {
      const brand = await this.brandRepository.findOne(payload.brandId);

      newProduct.brand = brand;
    }

    if (payload.categoriesIds) {
      const categories = await this.categoryRepository.findByIds(
        payload.categoriesIds,
      );

      newProduct.categories = categories;
    }

    return await this.productRepository.save(newProduct);
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.findById(id);

    if (payload.brandId) {
      const brand = await this.brandRepository.findOne(payload.brandId);

      product.brand = brand;
    }

    if (payload.categoriesIds) {
      const categories = await this.categoryRepository.findByIds(
        payload.categoriesIds,
      );

      product.categories = categories;
    }

    this.productRepository.merge(product, payload);

    return await this.productRepository.save(product);
  }

  async removeCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.findById(productId);

    product.categories = product.categories.filter(
      (category) => category.id !== categoryId,
    );

    return await this.productRepository.save(product);
  }

  async addCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.findById(productId);
    const category = await this.categoryRepository.findOne(categoryId, {});

    if (!category)
      throw new NotFoundException(`Category with id ${categoryId} not found`);

    product.categories.push(category);

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findById(id);

    await this.productRepository.delete(id);

    return product;
  }
}
