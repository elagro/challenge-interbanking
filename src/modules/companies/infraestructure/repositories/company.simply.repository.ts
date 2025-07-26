import { Injectable, OnModuleInit } from "@nestjs/common";
import { CompanyEntityDto } from "./dtos/company.dto";
import { CompanyRepository } from "../../domain/company.repository";
import { randomUUID } from "node:crypto";
import { FilePersist } from "src/shared/filePersist/filePersist";
import { AuditBase } from "src/shared/audit/audit.entity";
import { plainToInstance } from "class-transformer";
import { ObjectId } from "src/shared/types/types";
import { Company } from "../../domain/company";

@Injectable()
export class SimplyArrayCompanyRepository implements CompanyRepository, OnModuleInit  {
  private companies: Company[] = [];
  private filePersist: FilePersist = new FilePersist();

  
  constructor() {
  } 
  findByIds(ids: (ObjectId | string)[]): Promise<Company[] | null> {
    const stringIds = ids.map(id => id.toString());
    return Promise.resolve(this.companies.filter(company => company.id && stringIds.includes(company.id)));
  }

  async onModuleInit() {
    try {
      await this.filePersist.init('companies.json');
      const persistedCompanies = await this.filePersist.load();
    
      this.companies = plainToInstance(Company, persistedCompanies);
      
    } catch (error) {
      console.error('Error initializing the repository:', error);
    }
  }

  async save(company: Company): Promise<Company> {

    this.validateBeforeSave(company);

    company = { ...company, id: randomUUID() };
    AuditBase.simpleAudit(company);

    this.companies.push(company);

    await this.filePersist.save(this.companies);

    return company;
  }

  async findById(id: ObjectId): Promise<Company | null> {
    const idString = id.toHexString();
    const company = this.companies.find((company) => company.id === idString);

    if (!company) {
      return null;
    }

    return company;
  }

  async findAll(): Promise<Company[] | null> {
    const companies = this.companies;

    return companies || null;
  }

  async findByRegistrationDate(from: Date, to: Date): Promise<Company[] | null> {
    const companies = this.companies.filter((company) => {
      const registrationDate = company.registrationDate;
      return registrationDate >= from && registrationDate <= to;
    });

    return companies || null;
  }

  async findByCuit(cuit: string): Promise<Company | null> {
    return this.companies.find(company => company.cuit === cuit) || null;
  }

  private validateBeforeSave(company: Company) {
    const hasCompanyWithSameCuit = this.companies.find((x) => x.cuit === company.cuit);
    if (hasCompanyWithSameCuit) {
      throw new Error('Company with same CUIT already exists');
    }
  }

}