import { Injectable, NotFoundException } from '@nestjs/common';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brands.dto';

@Injectable()
export class BrandsService {
  private counterId = 0;
  private brands: Array<Brand> = [
    {
      id: 1,
      name: 'adidas',
      image: 'https://adidas.png',
    },
  ];

  findAll() {
    return this.brands;
  }

  findById(id: number) {
    const brand = this.brands.find((brand) => brand.id === id);

    if (!brand)
      throw new NotFoundException(`Brand with id ${id} not found in database`);

    return brand;
  }

  create(payload: CreateBrandDto) {
    const id = ++this.counterId;
    const newBrand = { id, ...payload };
    this.brands.push(newBrand);

    return newBrand;
  }

  update(id: number, payload: UpdateBrandDto) {
    const brand = this.findById(id);
    const index = this.brands.findIndex((brand) => brand.id === id);
    this.brands[index] = { ...brand, ...payload };

    return this.brands[index];
  }

  delete(id: number) {
    const brand = this.findById(id);
    this.brands = this.brands.filter((brand) => brand.id !== id);

    return brand;
  }
}