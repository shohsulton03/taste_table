import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Language, LanguageDocument } from './schemas/language.schema';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../category/schemas/category.schema';
import { Menu, MenuDocument } from '../menu/schemas/menu.schema';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
    // @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    // @InjectModel(Menu.name) private menuModel: Model<MenuDocument>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto) {
    return this.languageModel.create(createLanguageDto);
  }

  async findAll() {
    return this.languageModel.find();
  }

  async findOne(id: string) {
    return this.languageModel.findById(id);
  }

  async update(id: string, updateLanguageDto: UpdateLanguageDto) {
    return this.languageModel.findByIdAndUpdate(id, updateLanguageDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return this.languageModel.findByIdAndDelete(id);
  }
}
