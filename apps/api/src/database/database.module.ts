import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'SP1K3 R0',
            database: 'sam',
            autoLoadEntities: true,
            synchronize: true,
        })
    ],
})
export class DbModule {}