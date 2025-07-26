import { Injectable } from "@nestjs/common";
import { CompanyDocument, CompanyEntityDto } from "./dtos/company.dto";
import { CompanyRepository } from "../../domain/company.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "src/shared/types/types";
import { Company } from "../../domain/company";
import { CompanyMapper } from "./mappers/company.mapper";

@Injectable()
export class CompanyMongoRepository implements CompanyRepository {

  constructor(
    @InjectModel(CompanyEntityDto.name)
    private companyModel: Model<CompanyDocument>,
  ) { }

  async save(company: Company): Promise<Company> {
    const companyDto = CompanyMapper.toPersistence(company);
    const newCompany = new this.companyModel(companyDto);
    const savedCompany = await newCompany.save();
    return CompanyMapper.toDomain(savedCompany);
  }

  async findById(id: ObjectId): Promise<Company | null> {
    const company = await this.companyModel.findById(id).exec();
    return company ? CompanyMapper.toDomain(company) : null;
  }

  async findByIds(ids: (ObjectId | string)[]): Promise<Company[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const objectIds = ids.map(id => typeof id === 'string' ? new ObjectId(id) : id);
    const companies = await this.companyModel.find({ _id: { $in: objectIds } }).exec();
    return companies.map(CompanyMapper.toDomain);
  }

  async findAll(): Promise<Company[] | null> {
    const companies = await this.companyModel.find().exec();
    return companies.map(CompanyMapper.toDomain);
  }

  async findByRegistrationDate(from: Date, to: Date): Promise<Company[] | null> {
    const companies = await this.companyModel
      .find({
        registrationDate: {
          $gte: from,
          $lte: to,
        },
      })
      .exec();
    return companies.map(CompanyMapper.toDomain);
  }

  async findByCuit(cuit: string): Promise<Company | null> {
    const company = await this.companyModel
      .findOne({ cuit: cuit })
      .exec();
    return company ? CompanyMapper.toDomain(company) : null;
  }
}
