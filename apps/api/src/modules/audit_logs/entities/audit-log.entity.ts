import { BaseEntity } from "src/common/entities/base.entity";
import { enumCRUD } from "src/common/enums/crud.enum";
import { Column, Entity } from "typeorm";



@Entity('audit_logs')
export class AuditLogEntity extends BaseEntity {


    @Column({ name: 'entity_name' })
    entityName: string;

    @Column({ name: 'entity_index' })
    entityIndex: number;

    @Column({ type: 'varchar', length: 55 })
    action: string;

    @Column({ name: 'performed_by', nullable: true })
    performedBy: string;

    @Column({ name: 'performed_uuid', nullable: true })
    performedId: string;

    @Column({ type: 'json', name: 'old_data', nullable: true })
    oldData: string;

    @Column({ type: 'json', name: 'new_data', nullable: true  })
    newData: string;

    @Column({ nullable: true })
    context: string;

}