import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GendersService } from './genders.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'

@ApiTags('genders')
@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}


  @ApiOperation({ summary: 'Postea un nuevo genero' })
  @ApiResponse({ status: 200, description: 'Retorna el genero creado' })
  @Post()
  async create(@Body() createGenderDto: CreateGenderDto) {
    const created = await this.gendersService.create(createGenderDto);

    return {
      success: true,
      message: 'Genero creado',
      data: created
    }
  }


  @ApiOperation({ summary: 'Enlista todos los generos disponibles' })
  @ApiResponse({ status: 200, description: 'Retorna una lista de los animes que cumplan la condicion' })
  @ApiResponse({ status: 404, description: 'No halló el genero con ese criterio de busqueda' })
  @ApiQuery({ name: 'name', required: false, description: 'El nombre del genero' })
  @Get()
  findAll(@Query('name') name?: string) {

    if (name) return this.gendersService.findLikeGender(name);
    else return this.gendersService.findAll();

  }


  @ApiOperation({ summary: 'Enlista un genero por su id' })
  @ApiResponse({ status: 200, description: 'Retorna el genero por id' })
  @ApiResponse({ status: 404, description: 'No halló el genero con ese id' })
  @Get(':id')
  findOneIndex(@Param('id') id: string) {
    return this.gendersService.findOneIndex(+id);
  }

  @ApiOperation({ summary: 'Actualiza un genero' })
  @ApiResponse({ status: 200, description: 'Si' })
  @ApiResponse({ status: 404, description: 'No hallado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenderDto: UpdateGenderDto) {
    return this.gendersService.update(+id, updateGenderDto);
  }


  @ApiOperation({ summary: 'Elimina un genero' })
  @ApiResponse({ status: 200, description: 'Operation One' })
  @ApiResponse({ status: 404, description: 'Tu mamá' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gendersService.remove(+id);
  }
}
