import { Company } from "./company";
import { ObjectId } from "src/shared/types/types";

export interface CompanyRepository {
  save(company: Company): Promise<Company>;
  findById(id: ObjectId): Promise<Company | null>;
  findByIds(ids: (ObjectId | string)[]): Promise<Company[] | null>;
  findAll(): Promise<Company[] | null>;
  findByRegistrationDate(from: Date, to: Date): Promise<Company[] | null>;
  findByCuit(cuit: string): Promise<Company | null>;
}

export const COMPANY_REPOSITORY = Symbol('COMPANY_REPOSITORY');
