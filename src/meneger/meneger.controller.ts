import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { MenegerService } from './meneger.service';
import { CreateMenegerDto } from './dto/create-meneger.dto';
import { UpdateMenegerDto } from './dto/update-meneger.dto';
import { Response } from 'express';

@Controller('meneger')
export class MenegerController {
  constructor(private readonly menegerService: MenegerService) {}

  @Post()
  async create(@Body() createMenegerDto: CreateMenegerDto, @Res({passthrough: true}) res: Response) {
    return this.menegerService.create(createMenegerDto, res);
  }

  @Get()
  async findAll() {
    return this.menegerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.menegerService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenegerDto: UpdateMenegerDto) {
    return this.menegerService.update(id, updateMenegerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.menegerService.remove(id);
  }
}
