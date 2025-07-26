import { Inject, Injectable } from "@nestjs/common";
import { TRANSFER_REPOSITORY, TransferRepository } from "../../domain/transfer.repository";
import { Transfer } from "../../domain/transfer";

@Injectable()
export class CreateTransferUseCases {
    constructor(
        @Inject(TRANSFER_REPOSITORY) 
        private readonly transferRepository: TransferRepository,
    ) { }

    async execute(transfer: Transfer): Promise<Transfer> {
        return this.transferRepository.save(transfer);
    }
}