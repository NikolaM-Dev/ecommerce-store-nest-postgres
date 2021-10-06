import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsPositive, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly customerId: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
