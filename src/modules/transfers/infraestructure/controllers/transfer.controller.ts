import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponseSuccess, BaseApiResponse } from 'src/shared/model/api.model';
import { TransferResponseDto } from './transfer.response.dto';
import { TransferRequestDto } from './transfer.request.dto';
import { plainToInstance } from 'class-transformer';
import { TransferUseCases } from '../../application/transfer.usecases';


@Controller('transfers')
export class TransferController {
  private readonly TRANSFER_ERROR = 'TRANSFER_ERROR';

  constructor(
    private readonly transferUseCases: TransferUseCases,
  ) { }

  @Get()
  async getTransfers(): Promise<BaseApiResponse<TransferResponseDto[]>> {
    try {
      const transfers = await this.transferUseCases.getAllTransfers();
      const transferResponseDtos = TransferResponseDto.toResponseDtos(transfers);

      const response = new ApiResponseSuccess(transferResponseDtos);
      return response

    } catch (error) {
      const message = String(error.message);
      throw new BadRequestException(this.TRANSFER_ERROR, {
        cause: new Error(),
        description: message,
      });
    }
  }

  /**
   * Obtener las transferencias filtradas por fecha de efectividad.
   */
  @Get('/filter')
  async getTransfersByFilter(
    @Query('effectiveDateFrom') effectiveDateFrom?: string,
    @Query('effectiveDateTo') effectiveDateTo?: string,
  ): Promise<BaseApiResponse<TransferResponseDto[]>> {
    try {
      let fromDate: Date | undefined;
      let toDate: Date | undefined;

      if (effectiveDateFrom) {
        fromDate = new Date(effectiveDateFrom);
        if (isNaN(fromDate.getTime())) {
          throw new BadRequestException('Invalid effectiveDateFrom format. Please use ISO date format.');
        }
      }

      if (effectiveDateTo) {
        toDate = new Date(effectiveDateTo);
        if (isNaN(toDate.getTime())) {
          throw new BadRequestException('Invalid effectiveDateTo format. Please use ISO date format.');
        }
      }

      // Default to last month if no dates are provided
      if (!fromDate && !toDate) {
        fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);
        toDate = new Date();
      } else if (!fromDate) {
        // If only toDate is provided, set fromDate to the beginning of the toDate's month
        if (toDate) {
          fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
        } else {
           // This case should ideally not be reached if toDate is also undefined, handled by block above
          fromDate = new Date(0); // Or handle error: "effectiveDateFrom is required if effectiveDateTo is provided"
        }
      } else if (!toDate) {
        // If only fromDate is provided, set toDate to now
        toDate = new Date();
      }

      if (fromDate && toDate && fromDate > toDate) {
        throw new BadRequestException('effectiveDateFrom cannot be after effectiveDateTo.');
      }

      const transfers = await this.transferUseCases.getTransfersByEffectiveDate(fromDate, toDate);
      const transferResponseDtos = TransferResponseDto.toResponseDtos(transfers);

      const response = new ApiResponseSuccess(transferResponseDtos);
      return response

    } catch (error) {
      const message = String(error.message);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(this.TRANSFER_ERROR, {
        cause: new Error(),
        description: message,
      });
    }
  }

  @Post()
  async postTransfer(@Body() transferRequestDtoPlain: TransferRequestDto): Promise<BaseApiResponse<TransferResponseDto>> {
    try {
      const transferRequestDto = plainToInstance(TransferRequestDto, transferRequestDtoPlain);

      const transferDto = transferRequestDto.toTransferDto();
      const transferPersisted = await this.transferUseCases.createTransfer(transferDto)

      const transferResponseDto = TransferResponseDto.toResponseDto(transferPersisted);

      const response = new ApiResponseSuccess(transferResponseDto);
      return response;
    } catch (error) {
      const message = String(error.message);
      throw new BadRequestException(this.TRANSFER_ERROR, {
        cause: new Error(),
        description: message
      });
    }
  }

}