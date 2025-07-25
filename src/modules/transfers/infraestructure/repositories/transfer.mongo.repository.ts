import { Injectable } from "@nestjs/common";
import { TransferRepository } from "../../domain/transfer.repository";
import { TransferDocument, TransferEntityDto } from "../../domain/transfer.entity";
import { GetCompanyUseCases } from "src/modules/companies/application/usecases/getCompany.usecases";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Company } from "src/modules/companies/domain/company";
import { ObjectId } from "src/shared/types/types";
import { CompanyMapper } from "src/modules/companies/infraestructure/repositories/mappers/company.mapper";
import { CompanyEntityDto } from "src/modules/companies/infraestructure/repositories/dtos/company.dto";

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

  async findUniqueCompaniesByEffectiveDate(from: Date, to: Date): Promise<ObjectId[] | null> {
    return this.transferModel
      .aggregate([
        {
          $match: {
            effectiveDate: {
              $gte: from,
              $lte: to
            }
          }
        },
        {
          $group: {
            _id: "$companyIdFrom"
          }
        }
      ])
      .exec();
  }

  async findCompaniesWithTransfersInDateRange(from: Date, to: Date): Promise<Company[]> {
    const companiesDto = await this.transferModel.aggregate<CompanyEntityDto>([
      {
        $match: {
          effectiveDate: {
            $gte: from,
            $lte: to,
          },
        },
      },
      {
        $group: {
          _id: '$companyIdFrom',
        },
      },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: '$company',
      },
      {
        $replaceRoot: {
          newRoot: '$company',
        },
      },
    ]);

    return companiesDto.map(CompanyMapper.toDomain);
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
