import { forwardRef, Module } from '@nestjs/common';
import { GetCompanyUseCases } from '../application/usecases/getCompany.usecases';
import { CompanyController } from './controllers/company.controller';
import { COMPANY_REPOSITORY } from '../domain/company.repository';
import { CreateCompanyUseCases } from '../application/usecases/createCompany.usecases';
import { GetCompaniesUseCases } from '../application/usecases/getCompanies.usecases';
import { GetCompaniesByRegistrationDateUseCases } from '../application/usecases/getCompaniesByRegistrationDate.usecases';
import { GetCompaniesWithTransfersByRegistrationDateUseCase } from '../application/usecases/getCompaniesWithTransfersInLastMonth.usecases';
import { TransferModule } from 'src/modules/transfers/infraestructure/transfer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyEntityDto, CompanySchema } from '../domain/company.entity';
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
    GetCompanyUseCases,
    GetCompaniesUseCases,
    GetCompaniesByRegistrationDateUseCases,
    GetCompaniesWithTransfersByRegistrationDateUseCase,
    CreateCompanyUseCases,
    {
      provide: COMPANY_REPOSITORY,
      useClass: CompanyMongoRepository,
    },
  ],
  exports: [
    GetCompanyUseCases,
    GetCompaniesUseCases,
    GetCompaniesByRegistrationDateUseCases,
    GetCompaniesWithTransfersByRegistrationDateUseCase,
    CreateCompanyUseCases,
    COMPANY_REPOSITORY
  ],
})
export class CompanyModule {}
