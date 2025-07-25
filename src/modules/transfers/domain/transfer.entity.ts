import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { AuditBaseEntity } from "src/shared/audit/audit.entity";
import { ObjectId, ObjectIdSchemaType } from "src/shared/types/types";

@Schema({
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class TransferEntityDto extends AuditBaseEntity {
  _id?: ObjectId;

  @IsOptional()
  @IsString()
  id?: string;

  @Prop({ type: ObjectIdSchemaType, ref: 'companies', required: true })
  companyIdFrom: ObjectId;

  @IsString()
  @Prop({ required: true })
  accountIdFrom: string;

  @IsNumber()
  @Prop({ required: true })
  amount: number;

  @IsString()
  @Prop({ required: true })
  currency: string;

  @IsString()
  @Prop({ required: true })
  companyIdTo: string;

  @IsString()
  @Prop({ required: true })
  accountIdTo: string;

  @IsString()
  @Prop({ required: true })
  concept: string;

  @IsString()
  @Prop({ required: true })
  reference: string;

  @IsString()
  @Prop({ required: true })
  controlNumber: string;

  @Type(() => Date)
  @IsDate()
  @Prop({ required: true, index: true })
  effectiveDate: Date;
}

export type TransferDocument = TransferEntityDto & Document;
export const TransferSchema = SchemaFactory.createForClass(TransferEntityDto);

TransferSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : undefined;
});
