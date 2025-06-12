import { Inject, Injectable } from "@nestjs/common";
import { CompanyEntityDto } from "../domain/company.entity";
import { COMPANY_REPOSITORY, CompanyRepository } from "../domain/company.repository";
import { TRANSFER_REPOSITORY, TransferRepository } from "src/modules/transfers/domain/transfer.repository";
import { ObjectId } from "src/shared/types/types";

@Injectable()
export class CompanyUseCases {
    constructor(
        @Inject(COMPANY_REPOSITORY)
        private readonly companyRepository: CompanyRepository,
        @Inject(TRANSFER_REPOSITORY)
        private readonly transferRepository: TransferRepository,
    ) { }

    async createCompany(companyDto: CompanyEntityDto): Promise<CompanyEntityDto> {
        return this.companyRepository.save(companyDto);
    }

    async getCompanyById(id: ObjectId): Promise<CompanyEntityDto | null> {
        const company = await this.companyRepository.findById(id);
        return company;
    }

    async getAllCompanies(): Promise<CompanyEntityDto[]> {
        const companies = await this.companyRepository.findAll();
        if (!companies) {
            // Consistent error handling or allow repository to throw if that's the pattern
            throw new Error('Companies not found');
        }
        return companies;
    }

    async getCompaniesByRegistrationDate(from: Date, to: Date): Promise<CompanyEntityDto[]> {
        const companies = await this.companyRepository.findByRegistrationDate(from, to);
        if (!companies) {
             // Consistent error handling
            throw new Error('Companies not found for the given date range');
        }
        return companies;
    }

    async getCompaniesWithTransfersByEffectiveDate(from: Date, to: Date): Promise<CompanyEntityDto[]> {
        const companiesWithTransfer = await this.transferRepository.findCompaniesWithTransfersInDateRange(from, to);
        if (!companiesWithTransfer) {
            return []; // Or throw new Error('No companies found with transfers in the given date range');
        }
        return companiesWithTransfer;
    }
}
