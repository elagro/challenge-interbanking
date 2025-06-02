import { Injectable } from "@nestjs/common";
import { CompanyDocument, CompanyEntityDto } from "../../domain/company.entity";
import { CompanyRepository } from "../../domain/company.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "src/shared/types/types";

@Injectable()
export class CompanyMongoRepository implements CompanyRepository {

  constructor(
    @InjectModel(CompanyEntityDto.name)
    private companyModel: Model<CompanyDocument>,
  ) { }

  async save(company: CompanyEntityDto): Promise<CompanyEntityDto> {

    await this.validateBeforeSave(company);

    const newCompany = new this.companyModel(company);
    return newCompany.save();
  }

  async findById(id: ObjectId): Promise<CompanyEntityDto | null> {
    const company = await this.companyModel.findById(id).exec();

    if (!company) {
      return null;
    }

    return company;
  }

  async findByIds(ids: (ObjectId | string)[]): Promise<CompanyDocument[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const objectIds = ids.map(id => typeof id === 'string' ? new ObjectId(id) : id);
    return this.companyModel.find({ _id: { $in: objectIds } }).exec();
  }

  async findAll(): Promise<CompanyEntityDto[] | null> {
    return this.companyModel.find().exec();
  }

  async findByRegistrationDate(from: Date, to: Date): Promise<CompanyEntityDto[] | null> {
    return this.companyModel
      .find({
        registrationDate: {
          $gte: from,
          $lte: to,
        },
      })
      .exec();
  }

  async findByCuit(cuit: string): Promise<CompanyEntityDto[] | null> {
    return this.companyModel
      .find({ cuit: cuit })
      .exec();
  }

  private async validateBeforeSave(company: CompanyEntityDto) {
   
    const hasCompanyWithSameCuit = await this.findByCuit(company.cuit)
    if (!!hasCompanyWithSameCuit) {
      throw new Error('Company with same CUIT already exists');
    }
  }

}