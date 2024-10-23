import {
  Injectable,
} from '@nestjs/common';
import { CreateMenegerDto } from './dto/create-meneger.dto';
import { UpdateMenegerDto } from './dto/update-meneger.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Meneger, MenegerDocument } from './schemas/meneger.schema';
import { Model } from 'mongoose';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/schemas/restaurant.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class MenegerService {
  constructor(
    @InjectModel(Meneger.name) private readonly menegerModel: Model<MenegerDocument>,
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<MenegerDocument>,
    @InjectModel(Restaurant.name)
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(meneger: MenegerDocument) {
    const payload = {
      id: meneger._id,
      is_active: meneger.is_active,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  // async create(createMenegerDto: CreateMenegerDto, res: Response) {
  //   const { restaurant_id } = createMenegerDto;
  //   const restaurant = await this.restaurantModel.findById(restaurant_id);
  //   if (!restaurant) {
  //     throw new BadRequestException('Bunday Restoran yoq!');
  //   }

  //   const { password, confirm_password } = createMenegerDto;
  //   if (password !== confirm_password) {
  //     throw new BadRequestException('Parollar mos emas');
  //   }

  //   const hashed_password = await bcrypt.hash(password, 7);

  //   const newMeneger = await this.menegerModel.create({
  //     ...createMenegerDto,
  //     hashed_password,
  //   });

  //   const tokens = await this.generateTokens(newMeneger);
  //   const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
  //   newMeneger.hashed_refresh_token = hashed_refresh_token;
  //   await newMeneger.save();

  //   res.cookie('refresh_token', tokens.refresh_token, {
  //     httpOnly: true,
  //     maxAge: Number(process.env.REFRESH_TIME_MS),
  //   });

  //   const response = {
  //     message: 'Meneger creatd successfully!',
  //     access_token: tokens.access_token,
  //     id: newMeneger._id,
  //   };
  //   return response;
  // }

  async create(createMenegerDto: CreateMenegerDto, res: Response) {
    const newAdmin = await this.menegerModel.create(createMenegerDto);
    return newAdmin;
  }

  async findMenegerByEmail(email: string): Promise<Meneger> {
    return this.menegerModel.findOne({
      where: { email },
      include: {
        all: true,
        attributes: ['value'],
        through: { attributes: [] },
      },
    });
  }

  async findAll() {
    return this.menegerModel.find().populate('restaurant_id');
  }

  async findOne(id: string) {
    return this.menegerModel.findById(id).populate('restaurant_id');
  }

  async update(id: string, updateMenegerDto: UpdateMenegerDto) {
    return this.menegerModel
      .findByIdAndUpdate(id, updateMenegerDto)
      .populate('restaurant_id');
  }

  async remove(id: string) {
    return this.menegerModel.findByIdAndDelete(id);
  }
}
