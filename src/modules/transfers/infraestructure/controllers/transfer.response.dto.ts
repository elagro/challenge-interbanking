import { Expose } from "class-transformer";
import { TransferEntityDto } from "../../domain/transfer.entity";


export class TransferResponseDto {
  @Expose()
  id?: string;

  @Expose()
  companyIdFrom: string;

  @Expose()
  accountIdFrom: string;

  @Expose()
  amount: number;

  @Expose()
  currency: string;

  @Expose()
  companyIdTo: string;

  @Expose()
  accountIdTo: string;

  @Expose()
  concept: string;

  @Expose()
  reference: string;

  @Expose()
  controlNumber: string;

  @Expose()
  effectiveDate: Date;

  static toResponseDto(transferDto: TransferEntityDto | null): TransferResponseDto {
    const transfer = new TransferResponseDto();
    
    if (!transferDto) {
      return transfer;
    }

    transfer.id = transferDto.id;
    transfer.companyIdFrom = transferDto.companyIdFrom;
    transfer.accountIdFrom = transferDto.accountIdFrom;
    transfer.amount = transferDto.amount;
    transfer.currency = transferDto.currency;
    transfer.companyIdTo = transferDto.companyIdTo;
    transfer.accountIdTo = transferDto.accountIdTo;
    transfer.concept = transferDto.concept;
    transfer.reference = transferDto.reference;
    transfer.controlNumber = transferDto.controlNumber;
    transfer.effectiveDate = transferDto.effectiveDate;

    return transfer;
  }

  static toResponseDtos(transferDtos: TransferEntityDto[] | null): TransferResponseDto[] {
    if (!transferDtos || transferDtos.length === 0) {
      return [];
    }

    const transferResponseDtos = transferDtos.map((x) => TransferResponseDto.toResponseDto(x));

    return transferResponseDtos;
  }
}