import { Inject, Injectable } from "@nestjs/common";
import { TRANSFER_REPOSITORY, TransferRepository } from "../../domain/transfer.repository";
import { TransferEntityDto } from "../../domain/transfer.entity";

@Injectable()
export class GetTransfersUseCases {
    constructor(
        @Inject(TRANSFER_REPOSITORY) 
        private readonly transferRepository: TransferRepository,
    ) { }

    async execute(): Promise<TransferEntityDto[] | null> {
        const transfers = await this.transferRepository.findAll();

        return transfers;
    }
}