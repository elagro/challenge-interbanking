import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponseSuccess, BaseApiResponse } from 'src/shared/model/api.model';
import { GetTransfersByEffectiveDateUseCases } from '../../application/usecases/getTransfersByEffectiveDate.usecases';
import { GetTransfersUseCases } from '../../application/usecases/getTransfers.usecases';
import { TransferResponseDto } from './transfer.response.dto';
import { TransferRequestDto } from './transfer.request.dto';
import { plainToInstance } from 'class-transformer';
import { CreateTransferUseCases } from '../../application/usecases/createTransfer.usecases';


@Controller('transfer')
export class TransferController {
  private readonly TRANSFER_ERROR = 'TRANSFER_ERROR';

  constructor(
    private readonly getTransfersUseCases: GetTransfersUseCases,
    private readonly getTransfersByRegistrationDateUseCases: GetTransfersByEffectiveDateUseCases,
    private readonly createTransferUseCases: CreateTransferUseCases,
  ) { }

  @Get()
  async getTransfers(): Promise<BaseApiResponse<TransferResponseDto[]>> {
    try {
      const transfers = await this.getTransfersUseCases.execute();
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
   * Obtener las empresas que se adhirieron en el último mes.
   */
  @Get('/madeLastMonth')
  async getTransfersMadeLastMonth(): Promise<BaseApiResponse<TransferResponseDto[]>> {
    try {
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
      const toDate = new Date();

      const transfers = await this.getTransfersByRegistrationDateUseCases.execute(fromDate, toDate);
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

  @Post()
  async postTransfer(@Body() transferRequestDtoPlain: TransferRequestDto): Promise<BaseApiResponse<TransferResponseDto>> {
    try {
      const transferRequestDto = plainToInstance(TransferRequestDto, transferRequestDtoPlain);

      const transfer = transferRequestDto.toTransfer();
      const transferPersisted = await this.createTransferUseCases.execute(transfer)

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