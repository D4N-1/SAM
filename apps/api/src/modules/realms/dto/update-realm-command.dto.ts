import { PartialType } from "@nestjs/swagger";
import { CreateRealmCommandDto } from "./create-realm-command.dto";


export class UpdateRealmCommandDto extends PartialType(CreateRealmCommandDto) {}