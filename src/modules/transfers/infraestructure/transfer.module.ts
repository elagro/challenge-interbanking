import { forwardRef, Module } from '@nestjs/common';
import { TRANSFER_REPOSITORY } from '../domain/transfer.repository';
import { TransferController } from './controllers/transfer.controller';
import { CompanyModule } from 'src/modules/companies/infraestructure/company.module';
import { TransferMongoRepository } from './repositories/transfer.mongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { TransferUseCases } from '../application/transfer.usecases';
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
    TransferUseCases,
    {
      provide: TRANSFER_REPOSITORY,
      useClass: TransferMongoRepository,
    },
  ],
  exports: [
    TransferUseCases,
    TRANSFER_REPOSITORY
  ],
})
export class TransferModule {}
