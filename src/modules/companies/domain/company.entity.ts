import { Type } from "class-transformer";
import { IsDate } from "class-validator";
import { AuditBaseEntity } from "src/shared/audit/audit.entity";

export class CompanyEntityDto extends AuditBaseEntity {
    id?: string;
    name: string;
    cuit: string;
    address: string;
    phone: string;
    email: string;

    @Type(() => Date)
    @IsDate()
    registrationDate: Date;
}