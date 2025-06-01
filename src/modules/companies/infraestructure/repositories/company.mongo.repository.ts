import { Injectable } from "@nestjs/common";
import { CompanyDocument, CompanyEntityDto } from "../../domain/company.entity";
import { CompanyRepository } from "../../domain/company.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CompanyMongoRepository implements CompanyRepository  {

    constructor(
    @InjectModel(CompanyEntityDto.name)
    private companyModel: Model<CompanyDocument>,
  ) {}
  
  async save(company: CompanyEntityDto): Promise<CompanyEntityDto> {

    this.validateBeforeSave(company);

    //company.id = randomUUID();
    //AuditBase.simpleAudit(company);

    const newCompany = new this.companyModel(company);
    return newCompany.save();
  }

  async findById(id: string): Promise<CompanyEntityDto | null> {
    const company = await this.companyModel.findById(id).exec();
    
    if (!company) {
      return null;
    }

    return company;
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

  private validateBeforeSave(company: CompanyEntityDto) {
    console.log('Validating company before save:', company);
    /*const hasCompanyWithSameCuit = this.companies.find((x) => x.cuit === company.cuit);
    if (hasCompanyWithSameCuit) {
      throw new Error('Company with same CUIT already exists');
    }*/
  }

}