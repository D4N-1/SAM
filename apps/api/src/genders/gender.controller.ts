import { Controller, Get, Param } from "@nestjs/common"
import { GenderService } from "./gender.service"


@Controller('gender')
export class GenderController {
    constructor(private readonly GenderService: GenderService) {}

    @Get(':id')
    findOne(@Param('id') id:string) {
        return this.GenderService.findOne(+id)
    }
}