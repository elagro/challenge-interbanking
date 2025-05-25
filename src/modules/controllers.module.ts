import { Module } from '@nestjs/common';
import { CompanyController } from './companies/infraestructure/controllers/company.controller';
import { CompanyModule } from './companies/infraestructure/company.module';
import { TransferController } from './transfers/infraestructure/controllers/transfer.controller';
import { TransferModule } from './transfers/infraestructure/transfer.module';

@Module({
  imports: [
    CompanyModule,
    TransferModule
  ],
  providers: [],
  controllers: [
    CompanyController,
    TransferController,
  ],
})
export class ControllersModule {}
