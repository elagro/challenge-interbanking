import { Injectable, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { TransferRepository } from "../../domain/transfer.repository";
import { TransferEntityDto } from "../../domain/transfer.entity";
import { GetCompanyUseCases } from "src/modules/companies/application/usecases/getCompany.usecases";
import { FilePersist } from "src/shared/filePersist/filePersist";
import { AuditBase } from "src/shared/audit/audit.entity";
import { plainToInstance } from "class-transformer";

@Injectable()
export class SimplyArrayTransferRepository implements TransferRepository, OnModuleInit {
  private transfers: TransferEntityDto[] = [];
  private filePersist: FilePersist = new FilePersist();

  constructor(
    private readonly getCompanyUseCases: GetCompanyUseCases,
  ) {
    /*this.transfers = [
      {
        id: randomUUID(),
        companyIdFrom: '1',
        accountIdFrom: 'CA 100-4757801-3',
        amount: 42239.00,
        currency: 'ARS',

        companyIdTo: '2',
        accountIdTo: 'CC 015-997711-1',
        
        concept: 'varios',
        reference: 'pago de servicios',
        controlNumber: '1987',
        effectiveDate: new Date('2025-05-24'),
      },
      {
        id: randomUUID(),
        companyIdFrom: '2',
        accountIdFrom: 'CA 100-998877-3',
        amount: 457.00,
        currency: 'ARS',

        companyIdTo: '1',
        accountIdTo: 'CA 100-4757801-3',
        
        concept: 'Alquiler',
        reference: 'pago de alquiler',
        controlNumber: '0214',
        effectiveDate: new Date('2025-04-23'),
      }
    ];*/
  }



  async onModuleInit() {
    try {
      await this.filePersist.init('transfers.json');
      const persistedTransfers = await this.filePersist.load();
      
      this.transfers = plainToInstance(TransferEntityDto, persistedTransfers);

    } catch (error) {
      console.error('Error initializing the transfer file repository:', error);
    }
  }

  async save(transfer: TransferEntityDto): Promise<TransferEntityDto> {

    await this.validateBeforeSave(transfer);

    transfer.id = randomUUID();
    AuditBase.simpleAudit(transfer);

    this.transfers.push(transfer);

    await this.filePersist.save(this.transfers);
    return transfer;
  }

  async findById(id: string): Promise<TransferEntityDto | null> {
    const transfer = this.transfers.find((t) => t.id === id);

    if (!transfer) {
      return null;
    }

    return transfer;
  }

  async findAll(): Promise<TransferEntityDto[] | null> {
    const transfers = this.transfers;

    return transfers || null;
  }

  async findByEffectiveDate(from: Date, to: Date): Promise<TransferEntityDto[] | null> {
    const transfers = this.transfers.filter((t) => {
      const effectiveDate = t.effectiveDate;
      return effectiveDate >= from && effectiveDate <= to;
    });

    return transfers || null;
  }

  private async validateBeforeSave(transfer: TransferEntityDto) {
    const isValidAmount = transfer.amount > 0;

    if (!isValidAmount) {
      throw new Error('Invalid amount');
    }

    const isValidCompanyFrom = await this.getCompanyUseCases.execute(transfer.companyIdFrom);

    if (!isValidCompanyFrom) {
      throw new Error('Invalid company from');
    }
  }

}
