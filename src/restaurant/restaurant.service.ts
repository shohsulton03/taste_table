import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { Model } from 'mongoose';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantModel.create(createRestaurantDto);
  }

  async findAll() {
    return this.restaurantModel.find().populate('tables');
  }

  async findOne(id: string) {
    return this.restaurantModel.findById(id).populate('tables');
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const updatedRestaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      updateRestaurantDto,
      { new: true },
    );
    return updatedRestaurant.populate('tables');
  }

  async remove(id: string) {
    return this.restaurantModel.findByIdAndDelete(id);
  }
}
