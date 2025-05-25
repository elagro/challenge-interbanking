import { Type } from "class-transformer";
import { IsDate } from "class-validator";
import { AuditBaseEntity } from "src/shared/audit/audit.entity";

//export interface TransferEntityDto extends AuditBaseEntity {
export class TransferEntityDto extends AuditBaseEntity {
    id?: string;
    
    companyIdFrom: string;
    accountIdFrom: string;
    amount: number;
    currency: string;

    companyIdTo: string; //TODO cambiar de companía a entidad que contemple personas y empresas
    accountIdTo: string;
    
    concept: string;
    reference: string;
    controlNumber: string;

    @Type(() => Date)
    @IsDate()
    effectiveDate: Date;
}

