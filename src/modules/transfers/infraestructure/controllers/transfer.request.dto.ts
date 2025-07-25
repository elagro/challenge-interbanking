import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Transfer } from "../../domain/transfer";
import { ObjectId } from "src/shared/types/types";

export class TransferRequestDto {

  @IsString()
  @IsNotEmpty()
  companyIdFrom: string;

  @IsString()
  @IsNotEmpty()
  accountIdFrom: string;

  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  companyIdTo: string;

  @IsString()
  @IsNotEmpty()
  accountIdTo: string;

  @IsString()
  @IsNotEmpty()
  concept: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  controlNumber: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  effectiveDate: Date;

  toTransfer(): Transfer {
    return new Transfer(
      null,
      new ObjectId(this.companyIdFrom),
      this.accountIdFrom,
      this.amount,
      this.currency,
      this.companyIdTo,
      this.accountIdTo,
      this.concept,
      this.reference,
      this.controlNumber,
      this.effectiveDate
    );
  }
}