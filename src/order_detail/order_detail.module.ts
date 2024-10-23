import { Module } from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { OrderDetailController } from './order_detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetail, OrderDetailSchema } from './schemas/order_detail.schema';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { Waiter, WaiterSchema } from '../waiter/schemas/waiter.schema';
import { Menu, MenuSchema } from '../menu/schemas/menu.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderDetail.name,
        schema: OrderDetailSchema,
      },
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Menu.name,
        schema: MenuSchema,
      },
      {
        name: Waiter.name,
        schema: WaiterSchema,
      },
    ]),
  ],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
})
export class OrderDetailModule {}
