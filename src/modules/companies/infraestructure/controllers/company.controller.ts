import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompanyResponseDto } from './company.response.dto';
import { GetCompanyUseCases } from '../../application/usecases/getCompany.usecases';
import { ApiResponseSuccess, BaseApiResponse } from 'src/shared/model/api.model';
import { CompanyRequestDto } from './company.request.dto';
import { CreateCompanyUseCases } from '../../application/usecases/createCompany.usecases';
import { plainToInstance } from 'class-transformer';
import { GetCompaniesUseCases } from '../../application/usecases/getCompanies.usecases';
import { GetCompaniesByRegistrationDateUseCases } from '../../application/usecases/getCompaniesByRegistrationDate.usecases';


@Controller('company')
export class CompanyController {
  private readonly COMPANY_ERROR = 'COMPANY_ERROR';

  constructor(
    private readonly getCompanyUseCases: GetCompanyUseCases,
    private readonly getCompaniesUseCases: GetCompaniesUseCases,
    private readonly getCompaniesByRegistrationDateUseCases: GetCompaniesByRegistrationDateUseCases,
    private readonly createCompanyUseCases: CreateCompanyUseCases,
  ) { }

  @Get()
  async getCompanies(): Promise<BaseApiResponse<CompanyResponseDto[]>> {
    try {
      const companies = await this.getCompaniesUseCases.execute();
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

  /**
   * Obtener las empresas que se adhirieron en el último mes.
   */
  @Get('/addedLastMonth')
  async getCompaniesAddedLastMonth(): Promise<BaseApiResponse<CompanyResponseDto[]>> {
    try {
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
      const toDate = new Date();

      const companies = await this.getCompaniesByRegistrationDateUseCases.execute(fromDate, toDate);
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
      const company = await this.getCompanyUseCases.execute(id);
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
  async postCompany(@Body() companyRequestDtoPlain: CompanyRequestDto): Promise<BaseApiResponse<CompanyResponseDto>> {
    try {
      const companyRequestDto = plainToInstance(CompanyRequestDto, companyRequestDtoPlain);

      const companyDto = companyRequestDto.toCompanyDto();
      const companyPersisted = await this.createCompanyUseCases.execute(companyDto)

      const companyResponseDto = CompanyResponseDto.toResponseDto(companyPersisted);

      const response = new ApiResponseSuccess(companyResponseDto);
      return response;
    } catch (error) {
      const message = String(error.message);
      throw new BadRequestException(this.COMPANY_ERROR, {
        cause: new Error(),
        description: message,
      });
    }
  }
}