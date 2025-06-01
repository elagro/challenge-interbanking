import { Inject, Injectable } from "@nestjs/common";
import { TransferEntityDto } from "../../domain/transfer.entity";
import { TRANSFER_REPOSITORY, TransferRepository } from "../../domain/transfer.repository";


@Injectable()
export class GetTransfersByEffectiveDateUseCases {
    constructor(
        @Inject(TRANSFER_REPOSITORY) 
        private readonly transferRepository: TransferRepository,
    ) { }

    async execute(from: Date, to: Date): Promise<TransferEntityDto[]> {
        const transfers = await this.transferRepository.findByEffectiveDate(from, to);

        if (!transfers) {
            throw new Error('transfers not found');
        }

        return transfers;
    }
}