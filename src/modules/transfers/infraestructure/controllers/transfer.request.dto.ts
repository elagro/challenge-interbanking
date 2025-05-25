import { Expose, Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { TransferEntityDto } from "../../domain/transfer.entity";

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

  toTransferDto(): TransferEntityDto {
    return {
      companyIdFrom: this.companyIdFrom,
      accountIdFrom: this.accountIdFrom,
      amount: this.amount,
      currency: this.currency,
      companyIdTo: this.companyIdTo,
      accountIdTo: this.accountIdTo,
      concept: this.concept,
      reference: this.reference,
      controlNumber: this.controlNumber,
      effectiveDate: this.effectiveDate
    };
  }
}