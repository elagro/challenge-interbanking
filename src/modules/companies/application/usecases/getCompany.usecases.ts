import { Inject, Injectable } from "@nestjs/common";
import { CompanyEntityDto } from "../../domain/company.entity";
import { COMPANY_REPOSITORY, CompanyRepository } from "../../domain/company.repository";
import { ObjectId } from "src/shared/types/types";

@Injectable()
export class GetCompanyUseCases {
    constructor(
        @Inject(COMPANY_REPOSITORY) 
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(id: ObjectId): Promise<CompanyEntityDto | null> {
        const company = await this.companyRepository.findById(id);
        
        return company;
    }
}