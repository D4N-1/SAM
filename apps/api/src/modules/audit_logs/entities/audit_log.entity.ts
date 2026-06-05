import { BaseEntity } from "src/common/entities/base.entity";
import { enumCRUD } from "src/common/enums/crud.enum";
import { Column, Entity } from "typeorm";



@Entity('audit_logs')
export class AuditLogEntity extends BaseEntity {


    @Column({ name: 'entity_name' })
    entityName: string;

    @Column({ name: 'entity_index' })
    entityIndex: number;

    @Column({ type: 'enum', enum: enumCRUD })
    action: enumCRUD;

    @Column({ name: 'performed_by' })
    performedBy: string;

    @Column({ name: 'performed_index' })
    performedId: number;

    @Column({ type: 'json', name: 'old_data' })
    oldData: string;

    @Column({ type: 'json', name: 'new_data' })
    newData: string;

    @Column()
    context: string;

}