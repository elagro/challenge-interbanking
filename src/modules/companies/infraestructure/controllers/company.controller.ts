import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { CompanyResponseDto } from './company.response.dto';
import { ApiResponseSuccess, BaseApiResponse } from 'src/shared/model/api.model';
import { CompanyRequestDto } from './company.request.dto';
import { plainToInstance } from 'class-transformer';
import { getObjectId } from 'src/shared/types/types';
import { CompanyUseCases } from '../../application/company.usecases';


@Controller('companies')
export class CompanyController {
  private readonly COMPANY_ERROR = 'COMPANY_ERROR';

  constructor(
    private readonly companyUseCases: CompanyUseCases,
  ) { }

  @Get()
  async getCompanies(): Promise<BaseApiResponse<CompanyResponseDto[]>> {
    try {
      const companies = await this.companyUseCases.getAllCompanies();
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
  @Get('/filter')
  async getCompaniesByFilter(
    @Query('registeredFromDate') registeredFromDate?: string,
    @Query('registeredToDate') registeredToDate?: string,
  ): Promise<BaseApiResponse<CompanyResponseDto[]>> {
    try {
      let fromDate: Date | undefined;
      let toDate: Date | undefined;

      if (registeredFromDate) {
        fromDate = new Date(registeredFromDate);
        if (isNaN(fromDate.getTime())) {
          throw new BadRequestException('Invalid registeredFromDate format. Please use ISO date format.');
        }
      }

      if (registeredToDate) {
        toDate = new Date(registeredToDate);
        if (isNaN(toDate.getTime())) {
          throw new BadRequestException('Invalid registeredToDate format. Please use ISO date format.');
        }
      }

      // Default to last month if no dates are provided
      if (!fromDate && !toDate) {
        fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);
        toDate = new Date();
      } else if (!fromDate) {
        // If only toDate is provided, set fromDate to a very early date or handle as an error
        // For now, let's default fromDate to the beginning of the toDate's month if only toDate is present
        if (toDate) {
          fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
        } else {
          // This case should ideally not be reached if toDate is also undefined, handled by block above
          fromDate = new Date(0); // Or handle error: "registeredFromDate is required if registeredToDate is provided"
        }
      } else if (!toDate) {
        // If only fromDate is provided, set toDate to now
        toDate = new Date();
      }

      if (fromDate && toDate && fromDate > toDate) {
        throw new BadRequestException('registeredFromDate cannot be after registeredToDate.');
      }

      const companies = await this.companyUseCases.getCompaniesByRegistrationDate(fromDate, toDate);
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
   * Obtener las empresas con transferencias en un rango de fechas.
   */
  @Get('/with-transfers')
  async getCompaniesWithTransfersByDateRange(
    @Query('transfersFromDate') transfersFromDate?: string,
    @Query('transfersToDate') transfersToDate?: string,
  ): Promise<BaseApiResponse<CompanyResponseDto[]>> {
    try {
      let fromDate: Date;
      let toDate: Date;

      if (!transfersFromDate || !transfersToDate) {
        throw new BadRequestException('Both transfersFromDate and transfersToDate are required.');
      }

      fromDate = new Date(transfersFromDate);
      if (isNaN(fromDate.getTime())) {
        throw new BadRequestException('Invalid transfersFromDate format. Please use ISO date format.');
      }

      toDate = new Date(transfersToDate);
      if (isNaN(toDate.getTime())) {
        throw new BadRequestException('Invalid transfersToDate format. Please use ISO date format.');
      }

      if (fromDate > toDate) {
        throw new BadRequestException('transfersFromDate cannot be after transfersToDate.');
      }

      const companies = await this.companyUseCases.getCompaniesWithTransfersByEffectiveDate(fromDate, toDate);
      const companiesResponseDto = CompanyResponseDto.toResponseDtos(companies);

      const response = new ApiResponseSuccess(companiesResponseDto);
      return response

    } catch (error) {
      const message = String(error.message);
      // Specific check for BadRequestExceptions to avoid re-wrapping
      if (error instanceof BadRequestException) {
        throw error;
      }
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
      const company = await this.companyUseCases.getCompanyById(idAsObjectId);
      
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
  async postCompany(@Body() companyRequestDtoPlain: CompanyRequestDto): Promise<BaseApiResponse<CompanyResponseDto>> {
    try {
      const companyRequestDto = plainToInstance(CompanyRequestDto, companyRequestDtoPlain);

      const companyDto = companyRequestDto.toCompanyDto();
      const companyPersisted = await this.companyUseCases.createCompany(companyDto)

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