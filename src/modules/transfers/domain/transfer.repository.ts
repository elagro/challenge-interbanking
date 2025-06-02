import { ObjectId } from "src/shared/types/types";
import { TransferEntityDto } from "./transfer.entity";
import { CompanyEntityDto } from "src/modules/companies/domain/company.entity";

export interface TransferRepository {
  save(transfer: TransferEntityDto): Promise<TransferEntityDto>;
  findById(id: string): Promise<TransferEntityDto | null>;
  findAll(): Promise<TransferEntityDto[] | null>;
  findByEffectiveDate(from: Date, to: Date): Promise<TransferEntityDto[] | null>;
  findUniqueCompaniesByEffectiveDate(from: Date, to: Date): Promise<ObjectId[] | null>;
  findCompaniesWithTransfersInDateRange(from: Date, to: Date): Promise<CompanyEntityDto[]>; 
}

export const TRANSFER_REPOSITORY = Symbol('TRANSFER_REPOSITORY');
