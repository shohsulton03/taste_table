import { Module } from '@nestjs/common';
import { WaiterService } from './waiter.service';
import { WaiterController } from './waiter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Waiter, WaiterSchema } from './schemas/waiter.schema';
import { Restaurant, RestaurantSchema } from '../restaurant/schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Waiter.name,
        schema: WaiterSchema,
      },
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
    ]),
  ],
  controllers: [WaiterController],
  providers: [WaiterService],
})
export class WaiterModule {}
