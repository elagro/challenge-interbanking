import { Inject, Injectable } from "@nestjs/common";
import { CompanyEntityDto } from "../../domain/company.entity";
import { COMPANY_REPOSITORY, CompanyRepository } from "../../domain/company.repository";

@Injectable()
export class CreateCompanyUseCases {
    constructor(
        @Inject(COMPANY_REPOSITORY) 
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(companyDto: CompanyEntityDto): Promise<CompanyEntityDto> {
        return this.companyRepository.save(companyDto);
    }
}