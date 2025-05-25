import { Inject, Injectable } from "@nestjs/common";
import { TRANSFER_REPOSITORY, TransferRepository } from "../../domain/transfer.repository";
import { TransferEntityDto } from "../../domain/transfer.entity";

@Injectable()
export class CreateTransferUseCases {
    constructor(
        @Inject(TRANSFER_REPOSITORY) 
        private readonly transferRepository: TransferRepository,
    ) { }

    async execute(transferDto: TransferEntityDto): Promise<TransferEntityDto> {
        return this.transferRepository.save(transferDto);
    }
}