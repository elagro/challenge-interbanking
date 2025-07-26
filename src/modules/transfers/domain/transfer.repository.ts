import { ObjectId } from "src/shared/types/types";
import { Transfer } from "./transfer";
import { Company } from "src/modules/companies/domain/company";

export interface TransferRepository {
  save(transfer: Transfer): Promise<Transfer>;
  findById(id: string): Promise<Transfer | null>;
  findAll(): Promise<Transfer[] | null>;
  findByEffectiveDate(from: Date, to: Date): Promise<Transfer[] | null>;
  findUniqueCompaniesByEffectiveDate(from: Date, to: Date): Promise<ObjectId[] | null>;
  findCompaniesWithTransfersInDateRange(from: Date, to: Date): Promise<string[]>;
}

export const TRANSFER_REPOSITORY = Symbol('TRANSFER_REPOSITORY');
