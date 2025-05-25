import { CompanyEntityDto } from "./company.entity";

export interface CompanyRepository {
  save(company: CompanyEntityDto): Promise<CompanyEntityDto>;
  findById(id: string): Promise<CompanyEntityDto | null>;
  findAll(): Promise<CompanyEntityDto[] | null>;
  findByRegistrationDate(from: Date, to: Date): Promise<CompanyEntityDto[] | null>;
}

export const COMPANY_REPOSITORY = Symbol('COMPANY_REPOSITORY');
