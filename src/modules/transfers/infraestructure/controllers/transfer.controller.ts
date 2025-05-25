import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponseError, ApiResponseErrorDetail, ApiResponseSuccess, BaseApiResponse } from 'src/shared/model/api.model';
import { GetTransfersByRegistrationDateUseCases } from '../../application/usecases/getTransfersByRegistrationDate.usecases';
import { GetTransfersUseCases } from '../../application/usecases/getTransfers.usecases';
import { TransferResponseDto } from './transfer.response.dto';
import { TransferRequestDto } from './transfer.request.dto';
import { plainToInstance } from 'class-transformer';
import { CreateTransferUseCases } from '../../application/usecases/createTransfer.usecases';


@Controller('transfer')
export class TransferController {
  constructor(
    private readonly getTransfersUseCases: GetTransfersUseCases,
    private readonly getTransfersByRegistrationDateUseCases: GetTransfersByRegistrationDateUseCases,
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
      const code = 'TRANSFER_ERROR';

      const errorDetaill = ApiResponseErrorDetail.constructorFromError(code, error);

      return new ApiResponseError('Error al obtener las transferencias', errorDetaill);
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
      const code = 'TRANSFER_ERROR';

      const errorDetaill = ApiResponseErrorDetail.constructorFromError(code, error);

      return new ApiResponseError('Error al obtener las transferencias del último mes', errorDetaill);
    }
  }



  @Post()
  async postTransfer(@Body() transferRequestDtoPlain: TransferRequestDto): Promise<BaseApiResponse<TransferResponseDto>> {
    try {
      const transferRequestDto = plainToInstance(TransferRequestDto, transferRequestDtoPlain);

      const transferDto = transferRequestDto.toTransferDto();
      const transferPersisted = await this.createTransferUseCases.execute(transferDto)

      const transferResponseDto = TransferResponseDto.toResponseDto(transferPersisted);

      const response = new ApiResponseSuccess(transferResponseDto);
      return response;
    } catch (error) {
      const code = 'TRANSFER_NOT_CREATED';

      const errorDetaill = ApiResponseErrorDetail.constructorFromError(code, error);

      const response = new ApiResponseError('Error al crear la transferencia', errorDetaill);
      return response;
    }
  }

}