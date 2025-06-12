import { Inject, Injectable } from "@nestjs/common";
import { TRANSFER_REPOSITORY, TransferRepository } from "../domain/transfer.repository";
import { TransferEntityDto } from "../domain/transfer.entity";

@Injectable()
export class TransferUseCases {
    constructor(
        @Inject(TRANSFER_REPOSITORY)
        private readonly transferRepository: TransferRepository,
    ) { }

    async createTransfer(transferDto: TransferEntityDto): Promise<TransferEntityDto> {
        return this.transferRepository.save(transferDto);
    }

    async getAllTransfers(): Promise<TransferEntityDto[] | null> {
        // Original GetTransfersUseCases returns transfers or null.
        const transfers = await this.transferRepository.findAll();
        return transfers;
    }

    async getTransfersByEffectiveDate(from: Date, to: Date): Promise<TransferEntityDto[]> {
        // Original GetTransfersByEffectiveDateUseCases throws an error if not found.
        const transfers = await this.transferRepository.findByEffectiveDate(from, to);
        if (!transfers) {
            throw new Error('transfers not found');
        }
        return transfers;
    }
}
