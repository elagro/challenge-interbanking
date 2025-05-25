import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CompanyEntityDto } from "../../domain/company.entity";
import { COMPANY_REPOSITORY, CompanyRepository } from "../../domain/company.repository";

@Injectable()
export class GetCompanyUseCases {
    constructor(
        @Inject(COMPANY_REPOSITORY) 
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(id: string): Promise<CompanyEntityDto | null> {
        const company = await this.companyRepository.findById(id);
        
        return company;
    }
}