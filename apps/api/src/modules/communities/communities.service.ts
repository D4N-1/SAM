import { Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityEntity } from './entities/community.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(CommunityEntity)
    private CommunityRepository: Repository<CommunityEntity>
  ) {}

  create(createCommunityDto: CreateCommunityDto) {
    return 'This action adds a new community';
  }

  findAll() {
    return this.CommunityRepository.find();
  }

  findOne(id: number) {
    return this.CommunityRepository.find();
  }

  update(id: number, updateCommunityDto: UpdateCommunityDto) {
    return `This action updates a #${id} community`;
  }

  remove(id: number) {
    return `This action removes a #${id} community`;
  }
}
