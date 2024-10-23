import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { Client, ClientDocument } from '../client/schemas/client.schema';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/schemas/restaurant.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const {client_id, restaurant_id} = createOrderDto;
    const client = await this.clientModel.findById(client_id);
    const restaurant = await  this.restaurantModel.findById(restaurant_id);
    if (!client && !restaurant) {
      throw new BadRequestException("Bunday Mijoz va Restoran yo'q")
    }

    const order = await this.orderModel.create(createOrderDto);

    return order;
  }

  async findAll() {
    return this.orderModel.find().populate('client_id').populate('restaurant_id');
  }

  async findOne(id: string) {
    return this.orderModel
      .findById(id)
      .populate('client_id')
      .populate('restaurant_id');
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate('client_id')
      .populate('restaurant_id');
  }

  async remove(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }
}
