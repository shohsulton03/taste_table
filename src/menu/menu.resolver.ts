import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Menu } from './schemas/menu.schema';

@Resolver('menu')
export class  MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Mutation(() => Menu)
  async createMenu(@Args('CreateMenu') createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Query(() => [Menu])
  async findAllMenu() {
    return this.menuService.findAll();
  }

  @Query(() => Menu)
  async findOneMenu(@Args('id', { type: () => ID }) id: string) {
    return this.menuService.findOne(id);
  }

  @Mutation(() => Menu)
  async updateMenu(
    @Args('id', { type: () => ID }) id: string,
    @Args("UpdateMenu") updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Mutation(() => Number)
  async removeMenu(@Args('id', {type: () => ID}) id: string) {
    return this.menuService.remove(id);
  }
}
