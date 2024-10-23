import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';
import {
  Language,
  LanguageDocument,
} from '../language/schemas/language.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Language.name)
    private languageMadel: Model<LanguageDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }

  async findAll() {
    return this.categoryModel.find();
  }

  async findOne(id: string) {
    return this.categoryModel.findById(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto);
  }

  async updateByLangId(id: string, updateMenuCategoryDto: UpdateCategoryDto) {
    const language = await this.languageMadel.findById(
      updateMenuCategoryDto.language_id,
    );

    return this.categoryModel.findByIdAndUpdate(
      id,
      { ['name_' + language.language_code]: updateMenuCategoryDto.value },
      { new: true, strict: false },
    );
  }

  async remove(id: string) {
    return this.categoryModel.findByIdAndDelete(id);
  }
}
