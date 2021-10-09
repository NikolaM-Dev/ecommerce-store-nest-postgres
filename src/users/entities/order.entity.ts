import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Customer } from './customer.entity';
import { OrderItem } from './order-product.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Exclude()
  @OneToMany(() => OrderItem, (ordenItem) => ordenItem.order)
  items: OrderItem[];

  @Expose()
  get products() {
    if (!this.items) return [];

    return this.items
      .filter((item) => !!item)
      .map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));
  }

  @Expose()
  get total() {
    if (!this.items) return 0;

    return this.items
      .filter((item) => !!item)
      .reduce((total, item) => {
        const totalItem = item.product.price * item.quantity;

        return total + totalItem;
      }, 0);
  }
}
