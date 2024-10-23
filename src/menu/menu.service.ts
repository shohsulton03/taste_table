import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, MenuDocument } from './schemas/menu.schema';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from '../restaurant/schemas/restaurant.schema';
import { Category, CategoryDocument } from '../category/schemas/category.schema';
import { Language, LanguageDocument } from '../language/schemas/language.schema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name) private menuModel: Model<MenuDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const { category_id } = createMenuDto;
    const category = await this.categoryModel.findById(category_id);
    if (!category) {
      throw new BadRequestException('Bunday Categorya yoq!');
    }
    const newMenu = await this.menuModel.create(createMenuDto);

    // category.menus.push(newMenu); // ko'p munosabatda bo'g'lanish
    // await category.save();

    return newMenu;
  }

  async findAll() {
    return this.menuModel.find();
  }

  async findOne(id: string) {
    return this.menuModel.findById(id);
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    return this.menuModel.findByIdAndUpdate(id, updateMenuDto);
  }

  async remove(id: string) {
    return this.menuModel.findByIdAndDelete(id);
  }
}
