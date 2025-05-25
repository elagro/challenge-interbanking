import { Inject, Injectable } from "@nestjs/common";
import { CompanyEntityDto } from "../../domain/company.entity";
import { COMPANY_REPOSITORY, CompanyRepository } from "../../domain/company.repository";
import { GetTransfersByRegistrationDateUseCases } from "src/modules/transfers/application/usecases/getTransfersByRegistrationDate.usecases";

@Injectable()
export class GetCompaniesWithTransfersByRegistrationDateUseCase {
    constructor(
        @Inject(COMPANY_REPOSITORY)
        private readonly companyRepository: CompanyRepository,
        private readonly getTransfersByRegistrationDateUseCases: GetTransfersByRegistrationDateUseCases,
    ) { }

    async execute(from: Date, to: Date): Promise<CompanyEntityDto[]> {
        const transfersInLastMonth = await this.getTransfersByRegistrationDateUseCases.execute(from, to);

        if (!transfersInLastMonth || transfersInLastMonth.length === 0) {
            return [];
        }

        const uniqueCompaniesWithTransfersInLastMonth = [...new Set(transfersInLastMonth.map((t) => t.companyIdFrom))];

        const companies = (await Promise.all(
            uniqueCompaniesWithTransfersInLastMonth.map((t) => this.companyRepository.findById(t))
        )).filter((c): c is CompanyEntityDto => !!c);

        if (!companies || companies.length === 0) {
            return [];
        }

        return companies;
    }
}