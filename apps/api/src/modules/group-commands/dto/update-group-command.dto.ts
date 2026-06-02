import { PartialType } from "@nestjs/swagger";
import { CreateGroupCommandDto } from "./create-group-command.dto";


export class UpdateGroupCommandDto extends PartialType(CreateGroupCommandDto) {}