import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { gender } from "./entities/gender.entity";
import { Repository } from "typeorm";

@Injectable()
export class GenderService {

    constructor(
        @InjectRepository(gender)
        private readonly GenderRepo: Repository<gender>) {}

    async findOne(id: number): Promise<gender|null> {

        const res = this.GenderRepo.findOne({
            where: { index: id }
        })

        if (!res) throw new NotFoundException(`No se encontró algun genero con el ID ${id}`)

        return res

    }

    
}