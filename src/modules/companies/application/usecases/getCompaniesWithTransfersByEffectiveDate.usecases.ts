import { Inject, Injectable } from "@nestjs/common";
import { CompanyEntityDto } from "../../domain/company.entity";
import { COMPANY_REPOSITORY, CompanyRepository } from "../../domain/company.repository";
import { TRANSFER_REPOSITORY, TransferRepository } from "src/modules/transfers/domain/transfer.repository";
import { deprecate } from "node:util";

@Injectable()
export class GetCompaniesWithTransfersByEffectiveDateUseCase {
    constructor(
        @Inject(COMPANY_REPOSITORY)
        private readonly companyRepository: CompanyRepository,
        @Inject(TRANSFER_REPOSITORY)
        private readonly transferRepository: TransferRepository,
    ) { }

    /**
     * @deprecated("Use execute instead")
     * @param from 
     * @param to 
     * @returns 
     */
    private async executeDeprecated(from: Date, to: Date): Promise<CompanyEntityDto[]> {
        const companiesWithTransfer = await this.transferRepository.findUniqueCompaniesByEffectiveDate(from, to);

        if (!companiesWithTransfer || companiesWithTransfer.length === 0) {
            return [];
        }

        const companies = await this.companyRepository.findByIds(companiesWithTransfer);
        
        if (!companies || companies.length === 0) {
            return [];
        }

        return companies;
    }

    async execute(from: Date, to: Date): Promise<CompanyEntityDto[]> {
        const companiesWithTransfer = await this.transferRepository.findCompaniesWithTransfersInDateRange(from, to);

        if (!companiesWithTransfer || companiesWithTransfer.length === 0) {
            return [];
        }

        return companiesWithTransfer;
    }

}