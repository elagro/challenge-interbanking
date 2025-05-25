import { Module } from '@nestjs/common';
import { GetCompanyUseCases } from '../application/usecases/getCompany.usecases';
import { CompanyController } from './controllers/company.controller';
import { SimplyArrayCompanyRepository } from './repositories/company.repository';
import { COMPANY_REPOSITORY } from '../domain/company.repository';
import { CreateCompanyUseCases } from '../application/usecases/createCompany.usecases';
import { GetCompaniesUseCases } from '../application/usecases/getCompanies.usecases';
import { GetCompaniesByRegistrationDateUseCases } from '../application/usecases/getCompaniesByRegistrationDate.usecases';

@Module({
  controllers: [CompanyController],
  providers: [
    GetCompanyUseCases,
    GetCompaniesUseCases,
    GetCompaniesByRegistrationDateUseCases,
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
    CreateCompanyUseCases,
    COMPANY_REPOSITORY
  ],
})
export class CompanyModule {}
