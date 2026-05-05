import { Injectable } from '@nestjs/common';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { GendersEntity } from './entities/gender.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

@Injectable()
export class GendersService {
  constructor(
    @InjectRepository(GendersEntity)
    private GendersRepository: Repository<GendersEntity>,
  ) {}


  findAll(): Promise<GendersEntity[]> {
    return this.GendersRepository.find()
  }

  create(gender: CreateGenderDto) {
    const newGender = this.GendersRepository.create(gender)
    return this.GendersRepository.save(newGender)
  }

  findOneIndex(id: number): Promise<GendersEntity|null> {
    return this.GendersRepository.findOneBy({ index: id })
  }

  findLikeGender(name: string): Promise<GendersEntity[]|null> {
    return this.GendersRepository.findBy({ name: Like(`%${name}%`) })
  }

  async update(id: number, updateGenderDto: UpdateGenderDto) {
    const gender = await this.findOneIndex(id)

    await this.GendersRepository.update(id, updateGenderDto)

    return {
      success: true,
      message: 'Objeto actualizado',
      data: {
        updateGenderDto
      }
    }
  }

  async remove(id: number) {
    const deleted = await this.findOneIndex(id)

    await this.GendersRepository.softDelete({ index: id })

    return {
      success: true,
      message: 'Entidad eliminada con exito',
      data: deleted
    }


  }
}
