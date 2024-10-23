import { Module } from '@nestjs/common';
import { MenegerService } from './meneger.service';
import { MenegerController } from './meneger.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Meneger, MenegerSchema } from './schemas/meneger.schema';
import { JwtModule } from '@nestjs/jwt';
import { Restaurant, RestaurantSchema } from '../restaurant/schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Meneger.name,
        schema: MenegerSchema,
      },
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
    ]),
    JwtModule.register({}),
  ],
  controllers: [MenegerController],
  providers: [MenegerService],
  exports: [MenegerService],
})
export class MenegerModule {}
