import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { CompanyResponseDto } from './company.response.dto';
import { GetCompanyUseCases } from '../../application/usecases/getCompany.usecases';
import { ApiResponseSuccess, BaseApiResponse } from 'src/shared/model/api.model';
import { CompanyRequestDto } from './company.request.dto';
import { CreateCompanyUseCases } from '../../application/usecases/createCompany.usecases';
import { plainToInstance } from 'class-transformer';
import { GetCompaniesUseCases } from '../../application/usecases/getCompanies.usecases';
import { GetCompaniesByRegistrationDateUseCases } from '../../application/usecases/getCompaniesByRegistrationDate.usecases';
import { GetCompaniesWithTransfersByEffectiveDateUseCase } from '../../application/usecases/getCompaniesWithTransfersByEffectiveDate.usecases';
import { getObjectId } from 'src/shared/types/types';
import { CompanyAlreadyExistsError } from '../../domain/errors/company-already-exists.error';
import { Company } from '../../domain/company';


@Controller('companies')
export class CompanyController {
  private readonly COMPANY_ERROR = 'COMPANY_ERROR';

  constructor(
    private readonly getCompanyUseCases: GetCompanyUseCases,
    private readonly getCompaniesUseCases: GetCompaniesUseCases,
    private readonly getCompaniesByRegistrationDateUseCases: GetCompaniesByRegistrationDateUseCases,
    private readonly getCompaniesWithTransfersByRegistrationDateUseCase: GetCompaniesWithTransfersByEffectiveDateUseCase,
    private readonly createCompanyUseCases: CreateCompanyUseCases,
  ) { }

  @Get()
  async getCompanies(
    @Query('registeredFrom') registeredFrom?: string,
    @Query('registeredTo') registeredTo?: string,
    @Query('withTransfersSince') withTransfersSince?: string,
  ): Promise<BaseApiResponse<CompanyResponseDto[]>> {
    try {
      let companies: Company[];

      if (registeredFrom && registeredTo) {
        companies = await this.getCompaniesByRegistrationDateUseCases.execute(new Date(registeredFrom), new Date(registeredTo));
      } else if (withTransfersSince) {
        const companyIds = await this.getCompaniesWithTransfersByRegistrationDateUseCase.execute(new Date(withTransfersSince), new Date());
        // In a microservices architecture, you would typically fetch company details
        // from a dedicated company service using these IDs.
        // For now, we'll just return the IDs.
        const response = new ApiResponseSuccess(companyIds);
        return response;
      } else {
        companies = await this.getCompaniesUseCases.execute();
      }

      const companiesResponseDto = CompanyResponseDto.toResponseDtos(companies);

      const response = new ApiResponseSuccess(companiesResponseDto);
      return response

    } catch (error) {
      const message = String(error.message);
      throw new BadRequestException(this.COMPANY_ERROR, {
        cause: new Error(),
        description: message,
      });
    }
  }

  @Get('/:id')
  async getCompanyById(@Param('id') id: string): Promise<BaseApiResponse<CompanyResponseDto>> {
    try {
      const idAsObjectId = getObjectId(id);
      const company = await this.getCompanyUseCases.execute(idAsObjectId);
      
      if (!company) {
        throw new NotFoundException(`Company with id ${id} not found`);
      }

      const companyResponseDto = CompanyResponseDto.toResponseDto(company);
      
      const response = new ApiResponseSuccess(companyResponseDto);
      return response

    } catch (error) {
      const message = String(error.message);
      throw new BadRequestException(this.COMPANY_ERROR, {
        cause: new Error(),
        description: message,
      });
    }
  }

  @Post()
  /**
   * Registrar la adhesión de una nueva empresa. 
   */
  async createCompany(@Body() companyRequestDtoPlain: CompanyRequestDto): Promise<BaseApiResponse<CompanyResponseDto>> {
    try {
      const companyRequestDto = plainToInstance(CompanyRequestDto, companyRequestDtoPlain);

      const company = companyRequestDto.toCompany();
      const companyPersisted = await this.createCompanyUseCases.execute(company)

      const companyResponseDto = CompanyResponseDto.toResponseDto(companyPersisted);

      const response = new ApiResponseSuccess(companyResponseDto);
      return response;
    } catch (error) {
      if (error instanceof CompanyAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      const message = String(error.message);
      throw new BadRequestException(this.COMPANY_ERROR, {
        cause: new Error(),
        description: message,
      });
    }
  }
}