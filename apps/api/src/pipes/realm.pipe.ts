import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { RealmService } from "src/modules/realms/realm.service";


@Injectable()
export class RealmExistsPipe implements PipeTransform {
    constructor(
        private readonly realmService: RealmService
    ) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        
        if ( metadata.type !== 'param' || metadata.data !== 'realmName' ) return value;

        await this.realmService.findOneBy.name(value);
        return value
    }
}