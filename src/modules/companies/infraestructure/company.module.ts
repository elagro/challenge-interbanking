import { forwardRef, Module } from '@nestjs/common';
import { GetCompanyUseCases } from '../application/usecases/getCompany.usecases';
import { CompanyController } from './controllers/company.controller';
import { SimplyArrayCompanyRepository } from './repositories/company.repository';
import { COMPANY_REPOSITORY } from '../domain/company.repository';
import { CreateCompanyUseCases } from '../application/usecases/createCompany.usecases';
import { GetCompaniesUseCases } from '../application/usecases/getCompanies.usecases';
import { GetCompaniesByRegistrationDateUseCases } from '../application/usecases/getCompaniesByRegistrationDate.usecases';
import { GetCompaniesWithTransfersByRegistrationDateUseCase } from '../application/usecases/getCompaniesWithTransfersInLastMonth.usecases';
import { TransferModule } from 'src/modules/transfers/infraestructure/transfer.module';

@Module({
   imports: [
    forwardRef(() => TransferModule)
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
      useClass: SimplyArrayCompanyRepository,
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
