import { Injectable } from "@nestjs/common";
import { TransferRepository } from "../../domain/transfer.repository";
import { TransferDocument, TransferEntityDto } from "../../domain/transfer.entity";
import { GetCompanyUseCases } from "src/modules/companies/application/usecases/getCompany.usecases";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class TransferMongoRepository implements TransferRepository {
  
  constructor(
    @InjectModel(TransferEntityDto.name)
    private transferModel: Model<TransferDocument>,
    private readonly getCompanyUseCases: GetCompanyUseCases,
  ) { }

  async save(transfer: TransferEntityDto): Promise<TransferEntityDto> {

    await this.validateBeforeSave(transfer);

    const newTransfer = new this.transferModel(transfer);
    return newTransfer.save();
  }

  async findById(id: string): Promise<TransferEntityDto | null> {
    const transfer = await this.transferModel.findById(id).exec();
    
    if (!transfer) {
      return null;
    }

    return transfer;
  }

  async findAll(): Promise<TransferEntityDto[] | null> {
    return this.transferModel.find().exec();
  }

  async findByEffectiveDate(from: Date, to: Date): Promise<TransferEntityDto[] | null> {
    return this.transferModel
      .find({
        effectiveDate: {
          $gte: from,
          $lte: to,
        },
      })
      .exec();
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
