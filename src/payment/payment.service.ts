import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';
import {
  Reservation,
  ReservationDocument,
} from '../reservation/schemas/reservation.schema';
import { Client, ClientDocument } from '../client/schemas/client.schema';
import { OrderDetail, OrderDetailDocument } from '../order_detail/schemas/order_detail.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    @InjectModel(OrderDetail.name)
    private readonly orderDetailModel: Model<OrderDetailDocument>,
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { reservation_id, order_detail_id, client_id } = createPaymentDto;
    const reservation = await this.reservationModel.findById(reservation_id);
    const order_detail = await this.orderDetailModel.findById(order_detail_id);
    const client = await this.clientModel.findById(client_id);
    if (!reservation && !order_detail && !client) {
      throw new BadRequestException('Bunday Payment yoq!');
    }

    const newPayment = await this.paymentModel.create(createPaymentDto);
    return newPayment;
  }

  async findAll() {
    return this.paymentModel.find().populate('reservation_id').populate('order_detail_id').populate('client_id');
  }

  async findOne(id: string) {
    return this.paymentModel
      .findById(id)
      .populate('reservation_id')
      .populate('order_detail_id')
      .populate('client_id');
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentModel
      .findByIdAndUpdate(id, updatePaymentDto, { new: true })
      .populate('reservation_id')
      .populate('order_detail_id')
      .populate('client_id');
  }

  async remove(id: string) {
    return this.paymentModel.findByIdAndDelete(id);
  }
}
