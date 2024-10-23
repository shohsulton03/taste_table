import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { Restaurant, RestaurantSchema } from '../restaurant/schemas/restaurant.schema';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import { Language, LanguageSchema } from '../language/schemas/language.schema';
import { MenuResolver } from './menu.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Menu.name,
        schema: MenuSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
      {
        name: Language.name,
        schema: LanguageSchema,
      },
    ]),
  ],
  controllers: [MenuController],
  providers: [MenuService, MenuResolver],
})
export class MenuModule {}
