import { Expose } from "class-transformer";
import { Transfer } from "../../domain/transfer";


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

  static toResponseDto(transfer: Transfer | null): TransferResponseDto {
    const transferResponse = new TransferResponseDto();
    
    if (!transfer) {
      return transferResponse;
    }

    transferResponse.id = transfer.id;
    transferResponse.companyIdFrom = transfer.companyIdFrom.toHexString();
    transferResponse.accountIdFrom = transfer.accountIdFrom;
    transferResponse.amount = transfer.amount;
    transferResponse.currency = transfer.currency;
    transferResponse.companyIdTo = transfer.companyIdTo;
    transferResponse.accountIdTo = transfer.accountIdTo;
    transferResponse.concept = transfer.concept;
    transferResponse.reference = transfer.reference;
    transferResponse.controlNumber = transfer.controlNumber;
    transferResponse.effectiveDate = transfer.effectiveDate;

    return transferResponse;
  }

  static toResponseDtos(transfers: Transfer[] | null): TransferResponseDto[] {
    if (!transfers || transfers.length === 0) {
      return [];
    }

    const transferResponseDtos = transfers.map((x) => TransferResponseDto.toResponseDto(x));

    return transferResponseDtos;
  }
}