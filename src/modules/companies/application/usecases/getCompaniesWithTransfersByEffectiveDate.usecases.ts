import { Inject, Injectable } from "@nestjs/common";
import { TRANSFER_REPOSITORY, TransferRepository } from "src/modules/transfers/domain/transfer.repository";

@Injectable()
export class GetCompaniesWithTransfersByEffectiveDateUseCase {
    constructor(
        @Inject(TRANSFER_REPOSITORY)
        private readonly transferRepository: TransferRepository,
    ) { }

    async execute(from: Date, to: Date): Promise<string[]> {
        const companyIds = await this.transferRepository.findCompaniesWithTransfersInDateRange(from, to);

        if (!companyIds || companyIds.length === 0) {
            return [];
        }

        return companyIds;
    }

}