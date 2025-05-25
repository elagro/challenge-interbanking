import { Inject, Injectable } from "@nestjs/common";
import { CompanyEntityDto } from "../../domain/company.entity";
import { COMPANY_REPOSITORY, CompanyRepository } from "../../domain/company.repository";

@Injectable()
export class GetCompaniesByRegistrationDateUseCases {
    constructor(
        @Inject(COMPANY_REPOSITORY) 
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(from: Date, to: Date): Promise<CompanyEntityDto[]> {
        const companies = await this.companyRepository.findByRegistrationDate(from, to);

        if (!companies) {
            throw new Error('Companies not found');
        }

        return companies;
    }
}