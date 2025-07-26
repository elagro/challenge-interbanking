import { Transfer } from "src/modules/transfers/domain/transfer";
import { TransferEntityDto } from "../dtos/transfer.dto";

export class TransferMapper {
  static toDomain(transferDto: TransferEntityDto): Transfer {
    return new Transfer(
      transferDto.id,
      transferDto.companyIdFrom,
      transferDto.accountIdFrom,
      transferDto.amount,
      transferDto.currency,
      transferDto.companyIdTo,
      transferDto.accountIdTo,
      transferDto.concept,
      transferDto.reference,
      transferDto.controlNumber,
      transferDto.effectiveDate,
    );
  }

  static toPersistence(transfer: Transfer): TransferEntityDto {
    const transferDto = new TransferEntityDto();
    transferDto.id = transfer.id;
    transferDto.companyIdFrom = transfer.companyIdFrom;
    transferDto.accountIdFrom = transfer.accountIdFrom;
    transferDto.amount = transfer.amount;
    transferDto.currency = transfer.currency;
    transferDto.companyIdTo = transfer.companyIdTo;
    transferDto.accountIdTo = transfer.accountIdTo;
    transferDto.concept = transfer.concept;
    transferDto.reference = transfer.reference;
    transferDto.controlNumber = transfer.controlNumber;
    transferDto.effectiveDate = transfer.effectiveDate;
    return transferDto;
  }
}
