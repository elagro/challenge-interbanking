export class AuditBaseEntity {
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}

export abstract class AuditBase {
    static simpleAudit(obj: any) {
        !!obj.createdAt ? obj.updatedAt = new Date() : obj.createdAt = new Date();
        !!obj.createdBy ? obj.updatedBy = obj.createdBy + '.' : obj.createdBy = "Myself";
        return obj;
    }
}