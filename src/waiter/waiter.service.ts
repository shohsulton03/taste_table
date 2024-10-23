import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWaiterDto } from './dto/create-waiter.dto';
import { UpdateWaiterDto } from './dto/update-waiter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Waiter, WaiterDocument } from './schemas/waiter.schema';
import { Model } from 'mongoose';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/schemas/restaurant.schema';

@Injectable()
export class WaiterService {
  constructor(
    @InjectModel(Waiter.name) private waiterModel: Model<WaiterDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createWaiterDto: CreateWaiterDto) {
    const { restaurant_id } = createWaiterDto;
    const restaurant = await this.restaurantModel.findById(restaurant_id);
    if (!restaurant) {
      throw new BadRequestException('Bunday Restoran yoq!');
    }

    const newWaiter = await this.waiterModel.create(createWaiterDto);

    return newWaiter;
  }

  async findAll() {
    return this.waiterModel.find().populate('restaurant_id');
  }

  async findOne(id: string) {
    return (await this.waiterModel.findById(id)).populated('restaurant_id');
  }

  async update(id: string, updateWaiterDto: UpdateWaiterDto) {
    return this.waiterModel
      .findByIdAndUpdate(id, updateWaiterDto, { new: true })
      .populate('restaurant_id');
  }

  async remove(id: string) {
    return this.waiterModel.findByIdAndDelete(id);
  }
}
