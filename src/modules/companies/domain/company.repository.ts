import { CompanyEntityDto } from "./company.entity";
import { ObjectId } from "src/shared/types/types";

export interface CompanyRepository {
  save(company: CompanyEntityDto): Promise<CompanyEntityDto>;
  findById(id: ObjectId): Promise<CompanyEntityDto | null>;
  findByIds(ids: (ObjectId | string)[]): Promise<CompanyEntityDto[] | null>;
  findAll(): Promise<CompanyEntityDto[] | null>;
  findByRegistrationDate(from: Date, to: Date): Promise<CompanyEntityDto[] | null>;
}

export const COMPANY_REPOSITORY = Symbol('COMPANY_REPOSITORY');
