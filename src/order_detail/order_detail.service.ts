import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  OrderDetail,
  OrderDetailDocument,
} from './schemas/order_detail.schema';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import { Waiter, WaiterDocument } from '../waiter/schemas/waiter.schema';
import { Menu, MenuDocument } from '../menu/schemas/menu.schema';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectModel(OrderDetail.name)
    private readonly orderDetailModel: Model<OrderDetailDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Menu.name) private readonly menuModel: Model<MenuDocument>,
    @InjectModel(Waiter.name)
    private readonly waiterModel: Model<WaiterDocument>,
  ) {}

  async create(createOrderDetailDto: CreateOrderDetailDto) {
    const { order_id, menu_id, waiter_id } = createOrderDetailDto;
    const order = await this.orderModel.findById(order_id);
    const menu = await this.menuModel.findById(menu_id);
    const waiter = await this.waiterModel.findById(waiter_id);
    if (!order && !menu && !waiter) {
      throw new BadRequestException('Bunday Order detail yoq!');
    }

    const order_detail =
      await this.orderDetailModel.create(createOrderDetailDto);
    return order_detail;
  }

  async findAll() {
    return this.orderDetailModel
      .find()
      .populate('order_id')
      .populate('menu_id')
      .populate('waiter_id');
  }

  async findOne(id: string) {
    return this.orderDetailModel
      .findById(id)
      .populate('order_id')
      .populate('menu_id')
      .populate('waiter_id');
  }

  async update(id: string, updateOrderDetailDto: UpdateOrderDetailDto) {
    return this.orderDetailModel
      .findByIdAndUpdate(id, updateOrderDetailDto, { new: true })
      .populate('order_id')
      .populate('menu_id')
      .populate('waiter_id');
  }

  async remove(id: string) {
    return this.orderDetailModel.findByIdAndDelete(id);
  }
}
