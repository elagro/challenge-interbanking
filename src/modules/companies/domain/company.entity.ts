import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString } from "class-validator";
import { AuditBaseEntity } from "src/shared/audit/audit.entity";

@Schema({ timestamps: true })
export class CompanyEntityDto extends AuditBaseEntity {
    @IsOptional()
    @IsString()
    @Prop()
    id?: string;
    
    @IsString()
    @Prop({ required: true })
    name: string;

    @IsString()
    @Prop({ required: true, unique: true })
    cuit: string;
    
    @IsString()
    @Prop()
    address: string;
    
    @IsString()
    @Prop()
    phone: string;
    
    @IsEmail()
    @Prop()
    email: string;

    @Type(() => Date)
    @IsDate()
    @Prop({ type: Date, required: true })
    registrationDate: Date;
}

export type CompanyDocument = CompanyEntityDto & Document;
export const CompanySchema = SchemaFactory.createForClass(CompanyEntityDto);
