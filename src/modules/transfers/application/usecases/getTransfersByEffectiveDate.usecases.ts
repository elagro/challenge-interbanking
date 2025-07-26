import { Inject, Injectable } from "@nestjs/common";
import { TRANSFER_REPOSITORY, TransferRepository } from "../../domain/transfer.repository";
import { Transfer } from "../../domain/transfer";


@Injectable()
export class GetTransfersByEffectiveDateUseCases {
    constructor(
        @Inject(TRANSFER_REPOSITORY) 
        private readonly transferRepository: TransferRepository,
    ) { }

    async execute(from: Date, to: Date): Promise<Transfer[]> {
        const transfers = await this.transferRepository.findByEffectiveDate(from, to);

        if (!transfers) {
            throw new Error('transfers not found');
        }

        return transfers;
    }
}