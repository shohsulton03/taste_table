import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tables, TablesDocument } from './schemas/table.schema';
import { Model } from 'mongoose';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/schemas/restaurant.schema';

import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Tables.name) private tablesModel: Model<TablesDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  // QRCode generator function
  async generateQRCodeFile(text: string, fileName: string): Promise<string> {
    try {
      const qrCodeBuffer = await QRCode.toBuffer(text);
      const filePath = path.join(
        __dirname,
        '../public/qr-codes',
        `${fileName}.png`,
      );
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      fs.writeFileSync(filePath, qrCodeBuffer);

      return filePath;
    } catch (error) {
      throw new Error('Failed to generate or save QR Code');
    }
  }

  async create(createTableDto: CreateTableDto) {
    const { restaurant_id } = createTableDto;
    const restaurant = await this.restaurantModel.findById(restaurant_id);
    if (!restaurant) {
      throw new BadRequestException('Bunday Restoran yoq!');
    }
    const newTable = await this.tablesModel.create(createTableDto);

    // qrCode
    const baseUrl = `${process.env.API_URL}:${process.env.PORT}/api/menu`;
    const link = `${baseUrl}/${restaurant._id}/${newTable._id}`;
    await this.generateQRCodeFile(link, String(newTable._id));
    // const qrCode = await this.generateQRCodeFile(link)
    newTable.qr_code = link;
    await newTable.save();

    restaurant.tables.push(newTable); // ko'p munosabatda bo'g'lanish
    await restaurant.save();

    return newTable;
  }

  async findAll() {
    return this.tablesModel.find().populate('restaurant_id');
  }

  async findOne(id: string) {
    return this.tablesModel.findById(id).populate('restaurant_id');
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    const updatedTable = await this.tablesModel.findByIdAndUpdate(
      id,
      updateTableDto,
      { new: true },
    );
    return updatedTable.populate('restaurant_id');
  }

  async remove(id: string) {
    return this.tablesModel.findByIdAndDelete(id);
  }
}
