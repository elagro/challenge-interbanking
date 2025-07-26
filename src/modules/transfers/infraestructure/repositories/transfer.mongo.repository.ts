import { Injectable } from "@nestjs/common";
import { TransferRepository } from "../../domain/transfer.repository";
import { TransferDocument, TransferEntityDto } from "./dtos/transfer.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Company } from "src/modules/companies/domain/company";
import { ObjectId } from "src/shared/types/types";
import { CompanyMapper } from "src/modules/companies/infraestructure/repositories/mappers/company.mapper";
import { CompanyEntityDto } from "src/modules/companies/infraestructure/repositories/dtos/company.dto";
import { Transfer } from "../../domain/transfer";
import { TransferMapper } from "./mappers/transfer.mapper";

@Injectable()
export class TransferMongoRepository implements TransferRepository {

  constructor(
    @InjectModel(TransferEntityDto.name)
    private transferModel: Model<TransferDocument>,
  ) { }

  async save(transfer: Transfer): Promise<Transfer> {
    const transferDto = TransferMapper.toPersistence(transfer);
    const newTransfer = new this.transferModel(transferDto);
    const savedTransfer = await newTransfer.save();
    return TransferMapper.toDomain(savedTransfer);
  }

  async findById(id: string): Promise<Transfer | null> {
    const transfer = await this.transferModel.findById(id).exec();
    return transfer ? TransferMapper.toDomain(transfer) : null;
  }

  async findAll(): Promise<Transfer[] | null> {
    const transfers = await this.transferModel.find().exec();
    return transfers.map(TransferMapper.toDomain);
  }

  async findByEffectiveDate(from: Date, to: Date): Promise<Transfer[] | null> {
    const transfers = await this.transferModel
      .find({
        effectiveDate: {
          $gte: from,
          $lte: to,
        },
      })
      .exec();
    return transfers.map(TransferMapper.toDomain);
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

  async findCompaniesWithTransfersInDateRange(from: Date, to: Date): Promise<string[]> {
    const result = await this.transferModel.aggregate<{ _id: string }>([
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
        $project: {
          _id: 0,
          companyId: '$_id',
        },
      },
    ]);

    return result.map(item => item._id);
  }

}
