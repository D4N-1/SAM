import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DTO } from "../constants/generic.dto";


export class BaseEntity {

    @PrimaryGeneratedColumn()
    @Exclude()
    @ApiHideProperty()
    index: number;

    @ApiProperty({
        description: 'El identificador único del reino',
        example: DTO.UUID
    })
    @Column({ unique: true, type: 'uuid' })
    @Generated('uuid')
    uuid: string;

    
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
        
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
        
    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt: Date;
}