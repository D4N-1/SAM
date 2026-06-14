import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLogEntity } from "./entities/audit-log.entity";
import { AuditSubscriber } from "./audit-log-subscriber";
import { ClsModule } from "nestjs-cls";



@Module({
    imports: [
        TypeOrmModule.forFeature([AuditLogEntity]),
        ClsModule
    ],
    providers: [
        AuditSubscriber
    ]
})
export class AuditLogModule {}