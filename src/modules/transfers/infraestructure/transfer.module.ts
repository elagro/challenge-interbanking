import { forwardRef, Module } from '@nestjs/common';
import { GetTransfersByEffectiveDateUseCases } from '../application/usecases/getTransfersByRegistrationDate.usecases';
import { TRANSFER_REPOSITORY } from '../domain/transfer.repository';
import { TransferController } from './controllers/transfer.controller';
import { GetTransfersUseCases } from '../application/usecases/getTransfers.usecases';
import { CreateTransferUseCases } from '../application/usecases/createTransfer.usecases';
import { CompanyModule } from 'src/modules/companies/infraestructure/company.module';
import { TransferMongoRepository } from './repositories/transfer.mongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { TransferEntityDto, TransferSchema } from '../domain/transfer.entity';

@Module({
  imports: [
    forwardRef(() => CompanyModule),
    MongooseModule.forFeature([
      { name: TransferEntityDto.name, schema: TransferSchema, collection: 'transfers' },
    ]),
  ],
  controllers: [TransferController],
  providers: [
    GetTransfersUseCases,
    GetTransfersByEffectiveDateUseCases,
    CreateTransferUseCases,
    {
      provide: TRANSFER_REPOSITORY,
      useClass: TransferMongoRepository,
    },
  ],
  exports: [
    GetTransfersUseCases,
    GetTransfersByEffectiveDateUseCases,
    CreateTransferUseCases,
    TRANSFER_REPOSITORY
  ],
})
export class TransferModule {}
