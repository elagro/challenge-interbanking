import { forwardRef, Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { COMPANY_REPOSITORY } from '../domain/company.repository';
import { TransferModule } from 'src/modules/transfers/infraestructure/transfer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyEntityDto, CompanySchema } from '../domain/company.entity';
import { CompanyUseCases } from '../application/company.usecases';
import { CompanyMongoRepository } from './repositories/company.mongo.repository';

@Module({
   imports: [
    forwardRef(() => TransferModule),
    MongooseModule.forFeature([
      { name: CompanyEntityDto.name, schema: CompanySchema, collection: 'companies' },
    ]),
  ],
  controllers: [CompanyController],
  providers: [
    CompanyUseCases,
    {
      provide: COMPANY_REPOSITORY,
      useClass: CompanyMongoRepository,
    },
  ],
  exports: [
    CompanyUseCases,
    COMPANY_REPOSITORY
  ],
})
export class CompanyModule {}
