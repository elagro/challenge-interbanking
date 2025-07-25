import { Inject, Injectable } from "@nestjs/common";
import { Company } from "../../domain/company";
import { COMPANY_REPOSITORY, CompanyRepository } from "../../domain/company.repository";
import { CompanyAlreadyExistsError } from "../../domain/errors/company-already-exists.error";

@Injectable()
export class CreateCompanyUseCases {
    constructor(
        @Inject(COMPANY_REPOSITORY) 
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(company: Company): Promise<Company> {
        const existingCompany = await this.companyRepository.findByCuit(company.cuit);
        if (existingCompany) {
            throw new CompanyAlreadyExistsError(company.cuit);
        }
        return this.companyRepository.save(company);
    }
}