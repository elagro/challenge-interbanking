import { Inject, Injectable } from "@nestjs/common";
import { CompanyEntityDto } from "../../domain/company.entity";
import { TRANSFER_REPOSITORY, TransferRepository } from "src/modules/transfers/domain/transfer.repository";

@Injectable()
export class GetCompaniesWithTransfersByEffectiveDateUseCase {
    constructor(
        @Inject(TRANSFER_REPOSITORY)
        private readonly transferRepository: TransferRepository,
    ) { }

    async execute(from: Date, to: Date): Promise<CompanyEntityDto[]> {
        const companiesWithTransfer = await this.transferRepository.findCompaniesWithTransfersInDateRange(from, to);

        if (!companiesWithTransfer || companiesWithTransfer.length === 0) {
            return [];
        }

        return companiesWithTransfer;
    }

}