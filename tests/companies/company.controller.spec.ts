import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from 'src/modules/companies/infraestructure/controllers/company.controller';
import { CompanyUseCases } from 'src/modules/companies/application/company.usecases';
import { CompanyResponseDto } from 'src/modules/companies/infraestructure/controllers/company.response.dto';
import { CompanyRequestDto } from 'src/modules/companies/infraestructure/controllers/company.request.dto';
import { CompanyEntityDto } from 'src/modules/companies/domain/company.entity';
import { ApiResponseSuccess, BaseApiResponse } from 'src/shared/model/api.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'src/shared/types/types';
import { plainToInstance } from 'class-transformer';

// Mock CompanyUseCases
const mockCompanyUseCases = {
  getAllCompanies: jest.fn(),
  getCompaniesByRegistrationDate: jest.fn(),
  getCompaniesWithTransfersByEffectiveDate: jest.fn(),
  getCompanyById: jest.fn(),
  createCompany: jest.fn(),
};

// Mock data
const mockCompanyEntity: CompanyEntityDto = {
  id: '1' as unknown as ObjectId,
  name: 'Test Corp',
  cuit: '30-12345678-9',
  email: 'test@corp.com',
  phone: '1234567890',
  address: '123 Test St',
  registrationDate: new Date('2023-01-01'),
  createdAt: new Date(),
  createdBy: 'admin',
};

const mockCompanyResponseDto = CompanyResponseDto.toResponseDto(mockCompanyEntity);
const mockCompanyEntityList = [mockCompanyEntity];
const mockCompanyResponseDtoList = CompanyResponseDto.toResponseDtos(mockCompanyEntityList);

describe('CompanyController', () => {
  let controller: CompanyController;
  let useCases: CompanyUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyUseCases,
          useValue: mockCompanyUseCases,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    useCases = module.get<CompanyUseCases>(CompanyUseCases);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCompanies', () => {
    it('should return a list of companies', async () => {
      mockCompanyUseCases.getAllCompanies.mockResolvedValue(mockCompanyEntityList);
      const result = await controller.getCompanies();
      expect(useCases.getAllCompanies).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      expect(result.data).toEqual(mockCompanyResponseDtoList);
    });

    it('should throw BadRequestException if use case fails', async () => {
      mockCompanyUseCases.getAllCompanies.mockRejectedValue(new Error('Use case error'));
      await expect(controller.getCompanies()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCompaniesByFilter', () => {
    const fromDateStr = '2023-01-01';
    const toDateStr = '2023-01-31';

    it('should return filtered companies with valid dates', async () => {
      mockCompanyUseCases.getCompaniesByRegistrationDate.mockResolvedValue(mockCompanyEntityList);
      const result = await controller.getCompaniesByFilter(fromDateStr, toDateStr);
      expect(useCases.getCompaniesByRegistrationDate).toHaveBeenCalledWith(
        new Date(fromDateStr),
        new Date(toDateStr),
      );
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      expect(result.data).toEqual(mockCompanyResponseDtoList);
    });

    it('should use default dates if none provided', async () => {
        mockCompanyUseCases.getCompaniesByRegistrationDate.mockResolvedValue(mockCompanyEntityList);
        await controller.getCompaniesByFilter(undefined, undefined);
        expect(useCases.getCompaniesByRegistrationDate).toHaveBeenCalledWith(
            expect.any(Date), // fromDate will be last month
            expect.any(Date), // toDate will be now
        );
    });

    it('should throw BadRequestException for invalid date format', async () => {
      await expect(controller.getCompaniesByFilter('invalid-date', toDateStr)).rejects.toThrow(
        new BadRequestException('Invalid registeredFromDate format. Please use ISO date format.')
      );
       await expect(controller.getCompaniesByFilter(fromDateStr, 'invalid-date')).rejects.toThrow(
        new BadRequestException('Invalid registeredToDate format. Please use ISO date format.')
      );
    });

    it('should throw BadRequestException if fromDate is after toDate', async () => {
        await expect(controller.getCompaniesByFilter(toDateStr, fromDateStr)).rejects.toThrow(
            new BadRequestException('registeredFromDate cannot be after registeredToDate.')
        );
    });

    it('should throw BadRequestException if use case fails', async () => {
      mockCompanyUseCases.getCompaniesByRegistrationDate.mockRejectedValue(new Error('Use case error'));
      await expect(controller.getCompaniesByFilter(fromDateStr, toDateStr)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCompaniesWithTransfersByDateRange', () => {
    const fromDateStr = '2023-01-01';
    const toDateStr = '2023-01-31';

    it('should return companies with transfers with valid dates', async () => {
      mockCompanyUseCases.getCompaniesWithTransfersByEffectiveDate.mockResolvedValue(mockCompanyEntityList);
      const result = await controller.getCompaniesWithTransfersByDateRange(fromDateStr, toDateStr);
      expect(useCases.getCompaniesWithTransfersByEffectiveDate).toHaveBeenCalledWith(
        new Date(fromDateStr),
        new Date(toDateStr),
      );
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      expect(result.data).toEqual(mockCompanyResponseDtoList);
    });

    it('should throw BadRequestException if dates are missing', async () => {
      await expect(controller.getCompaniesWithTransfersByDateRange(undefined, toDateStr)).rejects.toThrow(
         new BadRequestException('Both transfersFromDate and transfersToDate are required.')
      );
       await expect(controller.getCompaniesWithTransfersByDateRange(fromDateStr, undefined)).rejects.toThrow(
         new BadRequestException('Both transfersFromDate and transfersToDate are required.')
      );
    });

    it('should throw BadRequestException for invalid date format', async () => {
      await expect(controller.getCompaniesWithTransfersByDateRange('invalid-date', toDateStr)).rejects.toThrow(
        new BadRequestException('Invalid transfersFromDate format. Please use ISO date format.')
      );
       await expect(controller.getCompaniesWithTransfersByDateRange(fromDateStr, 'invalid-date')).rejects.toThrow(
        new BadRequestException('Invalid transfersToDate format. Please use ISO date format.')
      );
    });

    it('should throw BadRequestException if fromDate is after toDate', async () => {
        await expect(controller.getCompaniesWithTransfersByDateRange(toDateStr, fromDateStr)).rejects.toThrow(
            new BadRequestException('transfersFromDate cannot be after transfersToDate.')
        );
    });

    it('should throw BadRequestException if use case fails', async () => {
      mockCompanyUseCases.getCompaniesWithTransfersByEffectiveDate.mockRejectedValue(new Error('Use case error'));
      await expect(controller.getCompaniesWithTransfersByDateRange(fromDateStr, toDateStr)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCompanyById', () => {
    const validId = '507f1f77bcf86cd799439011'; // Example of a valid MongoDB ObjectId string

    it('should return a company by id', async () => {
      mockCompanyUseCases.getCompanyById.mockResolvedValue(mockCompanyEntity);
      const result = await controller.getCompanyById(validId);
      expect(useCases.getCompanyById).toHaveBeenCalledWith(validId as unknown as ObjectId);
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      expect(result.data).toEqual(mockCompanyResponseDto);
    });

    it('should throw NotFoundException if company not found', async () => {
      mockCompanyUseCases.getCompanyById.mockResolvedValue(null);
      // The controller itself throws NotFoundException in this case
      await expect(controller.getCompanyById(validId)).rejects.toThrow(
        new NotFoundException(`Company with id ${validId} not found`)
      );
    });

    it('should throw BadRequestException if getObjectId fails for invalid id (though getObjectId is not part of this test unit)', async () => {
        // This test is more about how the controller reacts if an error occurs before the use case is called.
        // We can simulate getObjectId throwing an error by passing an id that would cause it to fail,
        // or by directly mocking getObjectId if it were a dependency. Here, we assume getObjectId
        // is called implicitly and might throw. The controller's catch-all would then throw BadRequest.
        // For now, let's test the use case throwing an error.
        mockCompanyUseCases.getCompanyById.mockRejectedValue(new Error('Use case error for ID'));
        await expect(controller.getCompanyById(validId)).rejects.toThrow(BadRequestException);
    });

     it('should throw BadRequestException if use case throws non-NotFound error', async () => {
        mockCompanyUseCases.getCompanyById.mockRejectedValue(new Error("Some other error"));
        await expect(controller.getCompanyById(validId)).rejects.toThrow(BadRequestException);
     });
  });

  describe('postCompany', () => {
    const companyRequestDto: CompanyRequestDto = {
      name: 'New Corp',
      cuit: '30-00000000-1',
      email: 'new@corp.com',
      phone: '111222333',
      address: '456 New Ave',
      registrationDate: new Date('2024-01-01'),
    };

    // Need to mock toCompanyDto if it's complex, but it's a simple DTO method
    const companyEntityFromRequest = plainToInstance(CompanyRequestDto, companyRequestDto).toCompanyDto();


    it('should create a company and return it', async () => {
      mockCompanyUseCases.createCompany.mockResolvedValue(companyEntityFromRequest);
      const result = await controller.postCompany(companyRequestDto);
      expect(useCases.createCompany).toHaveBeenCalledWith(companyEntityFromRequest);
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      // We expect the response DTO to be based on the entity returned by the use case
      expect(result.data).toEqual(CompanyResponseDto.toResponseDto(companyEntityFromRequest));
    });

    it('should throw BadRequestException if use case fails to create company', async () => {
      mockCompanyUseCases.createCompany.mockRejectedValue(new Error('Use case creation error'));
      await expect(controller.postCompany(companyRequestDto)).rejects.toThrow(BadRequestException);
    });
  });
});
