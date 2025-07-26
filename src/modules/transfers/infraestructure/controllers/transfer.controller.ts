import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponseSuccess, BaseApiResponse } from 'src/shared/model/api.model';
import { GetTransfersByEffectiveDateUseCases } from '../../application/usecases/getTransfersByEffectiveDate.usecases';
import { GetTransfersUseCases } from '../../application/usecases/getTransfers.usecases';
import { TransferResponseDto } from './transfer.response.dto';
import { TransferRequestDto } from './transfer.request.dto';
import { plainToInstance } from 'class-transformer';
import { CreateTransferUseCases } from '../../application/usecases/createTransfer.usecases';
import { Transfer } from '../../domain/transfer';


@Controller('transfers')
export class TransferController {
  private readonly TRANSFER_ERROR = 'TRANSFER_ERROR';

  constructor(
    private readonly getTransfersUseCases: GetTransfersUseCases,
    private readonly getTransfersByEffectiveDateUseCases: GetTransfersByEffectiveDateUseCases,
    private readonly createTransferUseCases: CreateTransferUseCases,
  ) { }

  @Get()
  async getTransfers(
    @Query('effectiveFrom') effectiveFrom?: string,
    @Query('effectiveTo') effectiveTo?: string,
  ): Promise<BaseApiResponse<TransferResponseDto[]>> {
    try {
      let transfers: Transfer[] | null;

      if (effectiveFrom && effectiveTo) {
        transfers = await this.getTransfersByEffectiveDateUseCases.execute(new Date(effectiveFrom), new Date(effectiveTo));
      } else {
        transfers = await this.getTransfersUseCases.execute();
      }

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
  async createTransfer(@Body() transferRequestDtoPlain: TransferRequestDto): Promise<BaseApiResponse<TransferResponseDto>> {
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