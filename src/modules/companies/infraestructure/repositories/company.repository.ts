import { Injectable, OnModuleInit } from "@nestjs/common";
import { CompanyEntityDto } from "../../domain/company.entity";
import { CompanyRepository } from "../../domain/company.repository";
import { randomUUID } from "node:crypto";
import { FilePersist } from "src/shared/filePersist/filePersist";
import { AuditBase } from "src/shared/audit/audit.entity";
import { plainToInstance } from "class-transformer";

@Injectable()
export class SimplyArrayCompanyRepository implements CompanyRepository, OnModuleInit  {
  private companies: CompanyEntityDto[] = [];
  private filePersist: FilePersist = new FilePersist();

  
  constructor() {
    /*this.companies = [
      {
        id: '1',
        name: 'Doe Company',
        cuit: '20-12345678-9',
        address: 'Av. Branch 159',
        phone: '123-456-7890',
        email: 'info@ib.c0m',
        registrationDate: new Date('2020-05-25'),
        createdAt: new Date('2020-05-25'),
        createdBy: 'Jhon Doe',
      },
      {
        id: '2',
        name: 'Flasa Holdings',
        cuit: '23-98765432-1',
        address: 'Ing. Main 357',
        phone: '654-3210',
        email: 'pipiripi@bankinginter.moc.ra',
        registrationDate: new Date('2023-10-04'),
        createdAt: new Date('2023-01-01'),
        createdBy: 'Pachu Michu',
        updatedAt: new Date(),
        updatedBy: 'Lio Issem',
      },
    ];*/
  } 

  async onModuleInit() {
    try {
      await this.filePersist.init('companies.json');
      //await this.filePersist.save(this.companies);
      const persistedCompanies = await this.filePersist.load();
    
      this.companies = plainToInstance(CompanyEntityDto, persistedCompanies);
      //this.companies = persistedCompanies as CompanyEntityDto[];
      
    } catch (error) {
      console.error('Error initializing the repository:', error);
    }
  }

  async save(company: CompanyEntityDto): Promise<CompanyEntityDto> {

    this.validateBeforeSave(company);

    company.id = randomUUID();
    AuditBase.simpleAudit(company);

    this.companies.push(company);

    await this.filePersist.save(this.companies);

    return company;
  }

  async findById(id: string): Promise<CompanyEntityDto | null> {
    const company = this.companies.find((company) => company.id === id);

    if (!company) {
      return null;
    }

    return company;
  }

  async findAll(): Promise<CompanyEntityDto[] | null> {
    const companies = this.companies;

    return companies || null;
  }

  async findByRegistrationDate(from: Date, to: Date): Promise<CompanyEntityDto[] | null> {
    const companies = this.companies.filter((company) => {
      const registrationDate = company.registrationDate;
      return registrationDate >= from && registrationDate <= to;
    });

    return companies || null;
  }

  private validateBeforeSave(company: CompanyEntityDto) {
    const hasCompanyWithSameCuit = this.companies.find((x) => x.cuit === company.cuit);
    if (hasCompanyWithSameCuit) {
      throw new Error('Company with same CUIT already exists');
    }
  }

}