import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { GroupService } from "src/modules/groups/group.service";


@Injectable()
export class GroupExistsPipe implements PipeTransform {
    constructor(
        private readonly groupService: GroupService
    ) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        
        if ( metadata.type !== 'param' || metadata.data !== 'uid' ) return value;

        return await this.groupService.findOneBy.uid(value);
    }
}