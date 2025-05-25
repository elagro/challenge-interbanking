import { forwardRef, Module } from '@nestjs/common';
import { GetTransfersByRegistrationDateUseCases } from '../application/usecases/getTransfersByRegistrationDate.usecases';
import { SimplyArrayTransferRepository } from './repositories/transfer.repository';
import { TRANSFER_REPOSITORY } from '../domain/transfer.repository';
import { TransferController } from './controllers/transfer.controller';
import { GetTransfersUseCases } from '../application/usecases/getTransfers.usecases';
import { CreateTransferUseCases } from '../application/usecases/createTransfer.usecases';
import { CompanyModule } from 'src/modules/companies/infraestructure/company.module';

@Module({
  imports: [
    forwardRef(() => CompanyModule)
  ],
  controllers: [TransferController],
  providers: [
    GetTransfersUseCases,
    GetTransfersByRegistrationDateUseCases,
    CreateTransferUseCases,
    {
      provide: TRANSFER_REPOSITORY,
      useClass: SimplyArrayTransferRepository,
    },
  ],
  exports: [
    GetTransfersUseCases,
    GetTransfersByRegistrationDateUseCases,
    CreateTransferUseCases,
    TRANSFER_REPOSITORY
  ],
})
export class TransferModule {}
