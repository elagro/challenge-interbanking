import { Inject, Injectable } from "@nestjs/common";
import { Company } from "../../domain/company";
import { COMPANY_REPOSITORY, CompanyRepository } from "../../domain/company.repository";

@Injectable()
export class GetCompaniesUseCases {
    constructor(
        @Inject(COMPANY_REPOSITORY) 
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(): Promise<Company[]> {
        const companies = await this.companyRepository.findAll();

        if (!companies) {
            throw new Error('Companies not found');
        }

        return companies;
    }
}