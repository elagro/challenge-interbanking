import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from 'src/modules/transfers/infraestructure/controllers/transfer.controller';
import { TransferUseCases } from 'src/modules/transfers/application/transfer.usecases';
import { TransferResponseDto } from 'src/modules/transfers/infraestructure/controllers/transfer.response.dto';
import { TransferRequestDto } from 'src/modules/transfers/infraestructure/controllers/transfer.request.dto';
import { TransferEntityDto } from 'src/modules/transfers/domain/transfer.entity';
import { ApiResponseSuccess, BaseApiResponse } from 'src/shared/model/api.model';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

// Mock TransferUseCases
const mockTransferUseCases = {
  getAllTransfers: jest.fn(),
  getTransfersByEffectiveDate: jest.fn(),
  createTransfer: jest.fn(),
};

// Mock data
const mockTransferEntity: TransferEntityDto = {
  id: 'transfer-id-1',
  companyIdFrom: 'company-id-from-1',
  accountIdFrom: 'account-id-from-1',
  amount: 1000,
  currency: 'USD',
  companyIdTo: 'company-id-to-1',
  accountIdTo: 'account-id-to-1',
  concept: 'Test Transfer',
  reference: 'Ref-001',
  controlNumber: 'Ctrl-001',
  effectiveDate: new Date('2023-10-01'),
  createdAt: new Date(),
  createdBy: 'admin',
};

const mockTransferResponseDto = TransferResponseDto.toResponseDto(mockTransferEntity);
const mockTransferEntityList = [mockTransferEntity];
const mockTransferResponseDtoList = TransferResponseDto.toResponseDtos(mockTransferEntityList);

describe('TransferController', () => {
  let controller: TransferController;
  let useCases: TransferUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: TransferUseCases,
          useValue: mockTransferUseCases,
        },
      ],
    }).compile();

    controller = module.get<TransferController>(TransferController);
    useCases = module.get<TransferUseCases>(TransferUseCases);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransfers', () => {
    it('should return a list of transfers', async () => {
      mockTransferUseCases.getAllTransfers.mockResolvedValue(mockTransferEntityList);
      const result = await controller.getTransfers();
      expect(useCases.getAllTransfers).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      expect(result.data).toEqual(mockTransferResponseDtoList);
    });

    it('should return an empty list if no transfers exist and use cases returns empty list', async () => {
      mockTransferUseCases.getAllTransfers.mockResolvedValue([]);
      const result = await controller.getTransfers();
      expect(useCases.getAllTransfers).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      expect(result.data).toEqual([]);
    });

    it('should return an empty list if no transfers exist and use cases returns null', async () => {
      // Controller transforms null from use case to empty array for response DTO
      mockTransferUseCases.getAllTransfers.mockResolvedValue(null);
      const result = await controller.getTransfers();
      expect(useCases.getAllTransfers).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      expect(result.data).toEqual([]); // toResponseDtos(null) results in []
    });

    it('should throw BadRequestException if use case fails', async () => {
      mockTransferUseCases.getAllTransfers.mockRejectedValue(new Error('Use case error'));
      await expect(controller.getTransfers()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTransfersByFilter', () => {
    const fromDateStr = '2023-01-01';
    const toDateStr = '2023-01-31';

    it('should return filtered transfers with valid dates', async () => {
      mockTransferUseCases.getTransfersByEffectiveDate.mockResolvedValue(mockTransferEntityList);
      const result = await controller.getTransfersByFilter(fromDateStr, toDateStr);
      expect(useCases.getTransfersByEffectiveDate).toHaveBeenCalledWith(
        new Date(fromDateStr),
        new Date(toDateStr),
      );
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      expect(result.data).toEqual(mockTransferResponseDtoList);
    });

    it('should use default dates if none provided', async () => {
        mockTransferUseCases.getTransfersByEffectiveDate.mockResolvedValue(mockTransferEntityList);
        await controller.getTransfersByFilter(undefined, undefined);
        expect(useCases.getTransfersByEffectiveDate).toHaveBeenCalledWith(
            expect.any(Date), // fromDate will be last month
            expect.any(Date), // toDate will be now
        );
    });

    it('should throw BadRequestException for invalid date format for effectiveDateFrom', async () => {
      await expect(controller.getTransfersByFilter('invalid-date', toDateStr)).rejects.toThrow(
        new BadRequestException('Invalid effectiveDateFrom format. Please use ISO date format.')
      );
    });

    it('should throw BadRequestException for invalid date format for effectiveDateTo', async () => {
       await expect(controller.getTransfersByFilter(fromDateStr, 'invalid-date')).rejects.toThrow(
        new BadRequestException('Invalid effectiveDateTo format. Please use ISO date format.')
      );
    });

    it('should throw BadRequestException if fromDate is after toDate', async () => {
        await expect(controller.getTransfersByFilter(toDateStr, fromDateStr)).rejects.toThrow(
            new BadRequestException('effectiveDateFrom cannot be after effectiveDateTo.')
        );
    });

    it('should throw BadRequestException if use case fails', async () => {
      mockTransferUseCases.getTransfersByEffectiveDate.mockRejectedValue(new Error('Use case error'));
      await expect(controller.getTransfersByFilter(fromDateStr, toDateStr)).rejects.toThrow(BadRequestException);
    });

    it('should rethrow BadRequestException if use case throws it', async () => {
      const specificError = new BadRequestException('Specific use case bad request');
      mockTransferUseCases.getTransfersByEffectiveDate.mockRejectedValue(specificError);
      await expect(controller.getTransfersByFilter(fromDateStr, toDateStr)).rejects.toThrow(specificError);
    });
  });

  describe('postTransfer', () => {
    const transferRequestDto: TransferRequestDto = {
      companyIdFrom: 'company-id-from-1',
      accountIdFrom: 'account-id-from-1',
      amount: 1500,
      currency: 'EUR',
      companyIdTo: 'company-id-to-2',
      accountIdTo: 'account-id-to-2',
      concept: 'New Test Transfer',
      reference: 'Ref-002',
      controlNumber: 'Ctrl-002',
      effectiveDate: new Date('2023-11-01'),
    };

    const transferEntityFromRequest = plainToInstance(TransferRequestDto, transferRequestDto).toTransferDto();

    it('should create a transfer and return it', async () => {
      mockTransferUseCases.createTransfer.mockResolvedValue(transferEntityFromRequest);
      const result = await controller.postTransfer(transferRequestDto);
      expect(useCases.createTransfer).toHaveBeenCalledWith(transferEntityFromRequest);
      expect(result).toBeInstanceOf(ApiResponseSuccess);
      expect(result.data).toEqual(TransferResponseDto.toResponseDto(transferEntityFromRequest));
    });

    it('should throw BadRequestException if use case fails to create transfer', async () => {
      mockTransferUseCases.createTransfer.mockRejectedValue(new Error('Use case creation error'));
      await expect(controller.postTransfer(transferRequestDto)).rejects.toThrow(BadRequestException);
    });
  });
});
