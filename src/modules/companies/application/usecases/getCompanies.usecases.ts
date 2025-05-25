import { Inject, Injectable } from "@nestjs/common";
import { CompanyEntityDto } from "../../domain/company.entity";
import { COMPANY_REPOSITORY, CompanyRepository } from "../../domain/company.repository";

@Injectable()
export class GetCompaniesUseCases {
    constructor(
        @Inject(COMPANY_REPOSITORY) 
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(): Promise<CompanyEntityDto[]> {
        const companies = await this.companyRepository.findAll();

        if (!companies) {
            throw new Error('Companies not found');
        }

        return companies;
    }
}