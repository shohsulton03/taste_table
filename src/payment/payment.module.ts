import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Client, ClientSchema } from '../client/schemas/client.schema';
import { Reservation, ReservationSchema } from '../reservation/schemas/reservation.schema';
import { OrderDetail, OrderDetailSchema } from '../order_detail/schemas/order_detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
      {
        name: OrderDetail.name,
        schema: OrderDetailSchema,
      },
      {
        name: Client.name,
        schema: ClientSchema,
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
