import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GendersService } from './genders.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Post()
  async create(@Body() createGenderDto: CreateGenderDto) {
    const created = await this.gendersService.create(createGenderDto);

    return {
      success: true,
      message: 'Genero creado',
      data: created
    }
  }

  @Get()
  findAll(@Query('name') name?: string) {

    if (name) return this.gendersService.findLikeGender(name);
    else return this.gendersService.findAll();

  }

  @Get(':id')
  findOneIndex(@Param('id') id: string) {
    return this.gendersService.findOneIndex(+id);
  }

  //////////////////////////////////////


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenderDto: UpdateGenderDto) {
    return this.gendersService.update(+id, updateGenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gendersService.remove(+id);
  }
}
