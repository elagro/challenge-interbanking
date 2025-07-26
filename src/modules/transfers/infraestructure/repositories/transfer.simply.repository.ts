import { Injectable, OnModuleInit } from "@nestjs/common";
import { TransferRepository } from "../../domain/transfer.repository";
import { randomUUID } from "node:crypto";
import { FilePersist } from "src/shared/filePersist/filePersist";
import { AuditBase } from "src/shared/audit/audit.entity";
import { plainToInstance } from "class-transformer";
import { ObjectId } from "src/shared/types/types";
import { Transfer } from "../../domain/transfer";

@Injectable()
export class SimplyArrayTransferRepository implements TransferRepository, OnModuleInit {
    private transfers: Transfer[] = [];
    private filePersist: FilePersist = new FilePersist();

    constructor() {
    }
    async findCompaniesWithTransfersInDateRange(from: Date, to: Date): Promise<string[]> {
        const transfers = await this.findByEffectiveDate(from, to);
        if (!transfers) return [];
        const companyIds = transfers.map(transfer => transfer.companyIdFrom.toHexString());
        const uniqueCompanyIds = [...new Set(companyIds)];
        return uniqueCompanyIds;
    }

    async onModuleInit() {
        try {
            await this.filePersist.init('transfers.json');
            const persistedTransfers = await this.filePersist.load();
            this.transfers = plainToInstance(Transfer, persistedTransfers);
        } catch (error) {
            console.error('Error initializing the repository:', error);
        }
    }

    async save(transfer: Transfer): Promise<Transfer> {
        transfer = { ...transfer, id: randomUUID() };
        AuditBase.simpleAudit(transfer);
        this.transfers.push(transfer);
        await this.filePersist.save(this.transfers);
        return transfer;
    }

    async findById(id: string): Promise<Transfer | null> {
        return this.transfers.find((transfer) => transfer.id === id) || null;
    }

    async findAll(): Promise<Transfer[] | null> {
        return this.transfers;
    }

    async findByEffectiveDate(from: Date, to: Date): Promise<Transfer[] | null> {
        return this.transfers.filter((transfer) => {
            const effectiveDate = transfer.effectiveDate;
            return effectiveDate >= from && effectiveDate <= to;
        });
    }

    async findUniqueCompaniesByEffectiveDate(from: Date, to: Date): Promise<ObjectId[] | null> {
        const transfers = await this.findByEffectiveDate(from, to);
        if (!transfers) return null;
        const companyIds = transfers.map(transfer => transfer.companyIdFrom);
        const uniqueCompanyIds = [...new Set(companyIds)];
        return uniqueCompanyIds;
    }
}
