import { Inject, Injectable } from "@nestjs/common";
import { TRANSFER_REPOSITORY, TransferRepository } from "../../domain/transfer.repository";
import { Transfer } from "../../domain/transfer";

@Injectable()
export class GetTransfersUseCases {
    constructor(
        @Inject(TRANSFER_REPOSITORY) 
        private readonly transferRepository: TransferRepository,
    ) { }

    async execute(): Promise<Transfer[] | null> {
        const transfers = await this.transferRepository.findAll();

        return transfers;
    }
}