import { TransferEntityDto } from "./transfer.entity";

export interface TransferRepository {
  save(transfer: TransferEntityDto): Promise<TransferEntityDto>;
  findById(id: string): Promise<TransferEntityDto | null>;
  findAll(): Promise<TransferEntityDto[] | null>;
  findByEffectiveDate(from: Date, to: Date): Promise<TransferEntityDto[] | null>;
}

export const TRANSFER_REPOSITORY = Symbol('TRANSFER_REPOSITORY');
